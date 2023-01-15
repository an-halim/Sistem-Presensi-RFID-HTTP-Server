import dotenv from "dotenv";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const users = {
  create: async (req, res) => {
    try {
      const data = req.body;
      // const { rfID, name, email, password, roles, role, apiKey } = req.body;

      let saltRound = 10;
      let salt = bcrypt.genSaltSync(saltRound);
      let hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;

      if (data.role === "user") {
        data.apiKey = "null";
      } else if (data.role === "admin") {
        data.apiKey = uuidv4();
      }

      User.create(data)
        .then((result) => {
          res.status(201).json({
            message: "Success",
            data: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Failed",
            data: [],
            error: err.name,
          });
        });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
      console.log(err);
    }
  },
  getAll: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });

      if (!users) {
        return res.status(404).json({
          message: "User not found",
          data: [],
        });
      }

      return res.status(200).json({
        message: "Success",
        data: users,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },
  update: async (req, res) => {
    const data = req.body;
    try {
      if (!data.rfID) {
        return res.status(400).json({
          message: "Please fill all the required fields",
          data: [],
        });
      }

      User.findOne({
        where: { rfID: data.rfID },
      })
        .then((result) => {
          if (data?.password) {
            let saltRound = 10;
            let salt = bcrypt.genSaltSync(saltRound);
            let hash = bcrypt.hashSync(data.password, salt);
            data.password = hash;
          }

          const newData = {
            data,
            ...result,
          };
          console.log(newData);

          User.update({ newData }, { where: { rfID: data.rfID } }).then(
            (result) => {
              return res.status(200).json({
                message: "Success",
                data: result,
              });
            }
          );
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            message: "Failed",
            data: [],
            error: err,
          });
        });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { rfID } = req.body;
      if (!rfID) {
        return res.status(400).json({
          message: "Please fill all the required fields",
          data: [],
        });
      }
      let check = await User.findOne({
        where: { rfID },
      });

      if (!check) {
        return res.status(400).json({
          message: "Failed",
          data: [],
          error: 'Hour with rfID "' + rfID + '" not found',
        });
      }

      User.destroy({
        where: { rfID },
      })
        .then((result) => {
          res.status(200).json({
            message: "Success",
            data: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Failed",
            data: [],
            error: err,
          });
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },
};

export default users;
