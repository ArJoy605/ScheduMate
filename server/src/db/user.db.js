import pool from "../configs/pool.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

const getUserByEmailDB = async (email) => {
  try {
    const { rows: user } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return user[0];
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};
export { getUserByEmailDB };
