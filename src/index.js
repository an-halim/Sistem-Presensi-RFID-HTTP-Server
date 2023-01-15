import express from "express";
import router from "./routes/index.js";
import db from "./db/index.js";
import morgan from "morgan";
import initTable from "./models/relations.js";
import bodyParser from "body-parser";

const app = express();

(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    await initTable();
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use("/api", router);

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
})();
