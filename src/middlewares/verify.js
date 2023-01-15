import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import roles from "../utils/roles.js"

dotenv.config();

const verify = (role) => {
  return (req, res, next) => {
    try {
      
      const token = req.headers?.authorization?.split(" ")[1] || req.cookies['token'];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (role === roles.admin) {
        if (decoded.role === role) {
          req.body.decoded = decoded;
          next();
        } else {
          // response.forbiden(res, "You are not authorized to access this endpoint");
          res.status(403).json({
            message: "You are not authorized to access this endpoint",
          });
        }
      } else if(role === roles.user) {
        if (decoded.role === role) {
          req.body.decoded = decoded;
          next();
        } else {
          res.status(403).json({
            message: "You are not authorized to access this endpoint",
          });
        }
      } else {
        req.body.decoded = decoded;
        next();
      }
    } catch (err) {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
}
export default verify;