import db from "../db/index.js";
import Sequelize from "sequelize";

const rfid = db.define("rfid", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rfID: {
    type: Sequelize.STRING,
    allowNull: false,
    // check in masuk, istirahat, pulang
  },
  isUsed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});


export default rfid;