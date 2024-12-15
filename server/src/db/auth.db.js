import pool from "../configs/pool.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

const registerUserDB = async (name, email, password) => {
  try {
    const { rows: user } = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    return user[0];
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};

export { registerUserDB };
