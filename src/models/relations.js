import user from "./users.js";
import presensi from "./presensi.js";
import rfid from "./rfid.js";
import hours from "./hours.js";
import bcrypt from "bcrypt";

let saltRound = 10;
let salt = bcrypt.genSaltSync(saltRound);

const initTable = async () => {
  try {
    await user.sync();
    await presensi.sync();
    await hours.sync();
    await rfid.sync();

 
    await user.hasMany(presensi, { foreignKey: "rfID" });
    await presensi.belongsTo(user, { foreignKey: "rfID" });

    await user.create({
      name: "Halim",
      email: "halimbla3@gmail.com",
      password: bcrypt.hashSync("asdasdasd", salt),
      roles: "mahasiswa",
      role: "admin",
      rfID: "test",
      apiKey: "test",
    });
    await hours.create({
      tipe: "masuk",
      roles: "mahasiswa",
      hour: "03:10:00",
    });

    await user.create({
      name: "Halim",
      email: "halimbla1@gmail.com",
      password: bcrypt.hashSync("asdasdasd", salt),
      roles: "pegawai",
      role: "admin",
      rfID: "aa",
    });
    await hours.create({
      tipe: "masuk",
      roles: "pegawai",
      hour: "10:10:00",
    });
  } catch (err) {
    // console.log(err.message);
  }
};

export default initTable;
