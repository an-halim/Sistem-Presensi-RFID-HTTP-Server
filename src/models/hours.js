import db from "../db/index.js";
import Sequelize from "sequelize";

const hours = db.define("hour", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipe: {
    type: Sequelize.STRING,
    allowNull: false,
    // check in masuk, istirahat, pulang
    isIn: [["istirahatOut", "masuk", "pulang", "istirahatIn"]],
  },
  roles: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hour: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,
});


export default hours;