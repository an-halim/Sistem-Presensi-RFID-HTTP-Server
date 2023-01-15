import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/users.js";
import bcrypt from "bcrypt";

dotenv.config();

const auth = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          data: [],
        });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          message: "Wrong password",
          data: [],
        });
      }

      const token = jwt.sign(
        { name: user.name, role: user.role, rfID: user.rfID },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "Success",
        data: {
          token: token,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
      console.log(err);
    }
  },

  detail: async (req, res) => {
    try {
      const userDetail = req.body;
      
      User.findOne({
        where: { rfID: userDetail.decoded.rfID },
        attributes: { exclude: ["password"] },
      })
        .then((result) => {
          res.status(200).json({
            message: "Success",
            data: result,
          });
        })
        .catch((err) => {
          res.status(401).json({
            message: "Unauthorized",
            data: [],
            error: err,
          });
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },

  logout: async (req, res) => {
    try {
      return response.success(res, "Logout successfully");
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        data: [],
      });
    }
  },
};

export default auth;
