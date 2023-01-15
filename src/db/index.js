import Sequelize from "Sequelize";

const config = {
  DB_NAME: "sistempresensi",
  DB_USER: "root",
  DB_PASSWORD: "",
  DB_HOST: "localhost",
};

const db = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: "mysql",
  port: 3306,
  logging: false,
});

export default db;
