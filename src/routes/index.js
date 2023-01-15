import express from "express";
import presensi from "../controllers/presensi.controller.js";
import rfid from "../controllers/rfid.controller.js";
import auth from "../controllers/auth.controller.js";
import hour from "../controllers/hours.controller.js";
import user from "../controllers/user.controller.js";
import verify from "../middlewares/verify.js";
import roles from "../utils/roles.js";

const router = express.Router();

router.get("/rfid/do", rfid.create);
router.delete("/rfid/delete", rfid.delete);
router.get("/rfid/all", rfid.delete);

router.get("/presensi/do", presensi.createPresensi);
router.get("/presensi", verify(roles.all), presensi.getAll);
router.put("/presensi", verify(roles.admin), presensi.update);
router.delete("/presensi", verify(roles.admin), presensi.delete);

router.post("/login", auth.login);
router.get("/detail", verify(roles.all), auth.detail);
router.delete("/logout", auth.logout);

router.post("/user", verify(roles.admin), user.create);
router.get("/user", verify(roles.admin), user.getAll);
router.put("/user", verify(roles.admin), user.update);
router.delete("/user", verify(roles.admin), user.delete);

router.post("/hour", verify(roles.admin), hour.create);
router.get("/hour", hour.getAll);
router.put("/hour", verify(roles.admin), hour.update);
router.delete("/hour", verify(roles.admin), hour.delete);

export default router;
