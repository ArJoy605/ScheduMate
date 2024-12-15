import jwt from "jsonwebtoken";

const signToken = (data, period) => {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: period });
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};

export default signToken;
