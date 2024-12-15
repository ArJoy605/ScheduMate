import userService from "../services/user.service.js";

// Profile endpoint
const getProfile = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { user_id, email, name } = await userService.decodeToken(token);
    return res.status(200).json({ status: "success", user_id, email, name });
  } catch (error) {
    next(error);
  }
};

// Login-status endpoint
const getLoginStatus = async (req, res) => {
  const { token } = req.cookies;
  const status = await userService.verifyToken(token);
  return res.json(status);
};

export { getProfile, getLoginStatus };
