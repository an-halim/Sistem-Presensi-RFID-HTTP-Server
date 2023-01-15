import db from "../db/index.js";
import Sequelize from "sequelize";
import user from "./users.js";

const presensi = db.define(
  "presensi",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rfID: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tipe: {
      type: Sequelize.STRING,
      allowNull: false,
      // check in masuk, istirahat, pulang
      isIn: [["istirahatOut", "masuk", "pulang", "istirahatIn"]],
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      // check in masuk, istirahat, pulang
      isIn: [["terlambat", "tepat"]],
    },
  },
  {
    freezeTableName: true,
  }
);

export default presensi;
