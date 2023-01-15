import dotenv from "dotenv";
import hours from "../models/hours.js";

dotenv.config();

const hour = {
  create: async (req, res) => {
    try {
      const data = req.body;
      // const { rfID, name, email, password, roles, role, apiKey } = req.body;

      const hourData = data?.hour?.split(":");
      if (hourData.length !== 3) {
        return res.status(400).json({
          message: "Failed",
          data: [],
          error: "Invalid hour format",
        });
      }

      hours
        .create(data)
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
      const hour = await hours.findAll();

      return res.status(200).json({
        message: "Success",
        data: hour,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },
  update: async (req, res) => {
    const data = req.body;
    const hourData = data?.hour?.split(":");

    try {
      if (!data.tipe || !data.roles || !data.hour || hourData?.length !== 3) {
        return res.status(400).json({
          message: "Please fill all the required fields with valid format",
          data: [],
        });
      }

      hours
        .findOne({
          where: { id: data.id },
        })
        .then((result) => {
          const newData = {
            data,
            ...result,
          };

          hours
            .update({ newData }, { where: { id: data.id } })
            .then((result) => {
              return res.status(200).json({
                message: "Success",
                data: result,
              });
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
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({
          message: "Please fill all the required fields",
          data: [],
        });
      }

      let check = await hours.findOne({
        where: { id },
      });

      if (!check) {
        return res.status(400).json({
          message: "Failed",
          data: [],
          error: 'Hour with id "' + id + '" not found',
        });
      }

      hours
        .destroy({
          where: { id },
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
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },
};

export default hour;
