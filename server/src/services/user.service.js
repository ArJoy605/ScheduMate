import jwt from "jsonwebtoken";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class UserService {
  async decodeToken(token) {
    if (!token) {
      throw new ErrorHandler(401, "Unauthorized. Please log in.");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new ErrorHandler(401, "Unauthorized. Please log in.");
    }
  }

  async verifyToken(token) {
    if (!token) {
      return false;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new UserService();
