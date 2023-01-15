import rfIDS from "../models/rfid.js";
import user from "../models/users.js";

const presensiHistory = {
  create: async (req, res) => {
    const { rfID, apiKey } = req.query;

    try {
      const isKey = await user.findOne({
        where: {
          apiKey,
        },
      });
      if (!isKey || apiKey === null) {
        return res.status(401).send("Unauthorized");
      }
      const users = await user.findOne({
        where: {
          rfID,
        },
      });
      if (!users) {
        return res.status(404).send("User not found");
      }


      rfIDS
        .create({
          rfID,
          isUsed: false
        })
        .then((data) => {
          res.status(201).send("Success");
        })
        .catch((err) => {
          res.status(400).send("Failed");
          console.log(err);
        });
    } catch (err) {
      res.status(500).send("Internal Server Error");
      console.log(err);
    }
  },

  delete: async (req, res) => {
    const { id } = req.query;
    try {
      let deleteIDS = await rfIDS.destroy({
        where: {
          id,
        },
      });
      if (deleteIDS) {
        res.status(200).json({
          message: "Success",
          data: [],
        });
      } else {
        res.status(400).json({
          message: "Failed",
          data: [],
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getAll: async (req, res) => {
    try {

      let ids = await rfIDS.findAll();
      return res.status(200).json({
        message: "Success",
        data: ids,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

export default presensiHistory;
