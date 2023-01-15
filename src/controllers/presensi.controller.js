import presensi from "../models/presensi.js";
import hours from "../models/hours.js";
import user from "../models/users.js";
import { Op } from "sequelize";
import tipes from "../utils/constanta.js";

const presensiHistory = {
  createPresensi: async (req, res) => {
    const { rfID, tipe, apiKey } = req.query;
    let date = String(new Date()).split(" ")[4];
    let status = "";

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
        // send document
      }

      const checkTipe = tipes[tipe];
      console.log(checkTipe);
      if (checkTipe === undefined) {
        return res.status(400).send("Tipe not found");
      }

      const hour = await hours.findOne({
        where: {
          [Op.and]: [{ roles: users.roles }, { tipe: tipes[tipe] }],
        },
      });

      if (!hour) {
        return res.status(400).send("Tipe not found");
      }

      if (date > hour.hour) {
        status = "terlambat";
      }
      if (date <= hour.hour) {
        status = "tepat";
      }

      presensi
        .create({
          status,
          rfID,
          tipe: tipes[tipe],
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
    const { id } = req.body;
    try {
      let deletePresensi = await presensi.destroy({
        where: {
          id,
        },
      });
      if (deletePresensi) {
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
      const data = req.body;

      if (data.decoded.role === "admin") {
        let presensies = await presensi.findAll({
          include: [
            {
              model: user,
              attributes: ["name", "roles"],
            },
          ],
        });
        res.status(200).json({
          message: "Success",
          data: presensies,
        });
      } else {
        let presensies = await presensi.findAll({
          where: {
            rfID: data.decoded.rfID,
          },
          include: [
            {
              model: user,
              attributes: ["name", "roles"],
            },
          ],
        });
        res.status(200).json({
          message: "Success",
          data: presensies,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  update: async (req, res) => {
    const { id, status } = req.body;
    try {
      if (!id) {
        return res.status(400).json({
          message: "Please fill all the required fields",
          data: [],
        });
      }

      let check = await presensi.findOne({
        where: { id },
      });

      if (!check) {
        return res.status(400).json({
          message: "Failed",
          data: [],
          error: 'Hour with id "' + id + '" not found',
        });
      }

      let updatePresensi = await presensi.update(
        {
          status,
        },
        {
          where: {
            id,
          },
        }
      );
      if (updatePresensi) {
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
};

export default presensiHistory;
