import { ErrorHandler } from "../middlewares/errorHandler.js";
import { registerUserDB } from "../db/auth.db.js";
import { getUserByEmailDB } from "../db/user.db.js";
import { hashPassword, comparePassword } from "../helpers/hashPassword.js";
import signToken from "../helpers/signToken.js";

class AuthService {
  async register(user) {
    const { name, email, password, confirmPass } = user;

    if (!name) {
      throw new ErrorHandler(400, "Name cannot be empty");
    }
    if (!email) {
      throw new ErrorHandler(400, "Email cannot be empty");
    }
    if (!password) {
      throw new ErrorHandler(400, "Password cannot be empty");
    }
    if (password.length < 8) {
      throw new ErrorHandler(400, "Password length should be at least 8");
    }
    if (!confirmPass) {
      throw new ErrorHandler(401, "Type password again to confirm");
    }
    if (password !== confirmPass) {
      throw new ErrorHandler(401, "Passwords do not match");
    }

    const existingUser = await getUserByEmailDB(email);
    if (existingUser) {
      throw new ErrorHandler(409, "Email is already registered");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await registerUserDB(name, email, hashedPassword);

    return newUser;
  }

  async login(user) {
    const { email, password } = user;

    if (!email) {
      throw new ErrorHandler(400, "Email cannot be empty");
    }
    if (!password) {
      throw new ErrorHandler(400, "Password cannot be empty");
    }

    const existingUser = await getUserByEmailDB(email);
    if (!existingUser) {
      throw new ErrorHandler(401, "Invalid email or password");
    }

    const { user_id, name, password: storedPassword } = existingUser;
    const isCorrectPassword = await comparePassword(password, storedPassword);
    if (!isCorrectPassword) {
      throw new ErrorHandler(401, "Invalid email or password");
    }

    const token = signToken({ user_id, email, name }, 24 * 60 * 60);

    return { token, existingUser };
  }
}

export default new AuthService();
