import classroomService from "../services/classroom.service.js";

// Create Class endpoint
const createClass = async (req, res, next) => {
  try {
    const classInfo = await classroomService.create(req.body);
    return res.status(201).json({ status: "success", classInfo });
  } catch (error) {
    next(error);
  }
};

// Join Class endpoint
const joinClass = async (req, res, next) => {
  try {
    const userInfo = await classroomService.join(req.body);
    return res.status(201).json({ status: "success", userInfo });
  } catch (error) {
    next(error);
  }
};

// Get ClassList endpoint
const getClassAndUserList = async (req, res, next) => {
  try {
    const {
      classList,
      classIdToUserIdMap,
      userIdToNameMap,
      userIdToEmailMap,
      userIdToRoleMap,
    } = await classroomService.getList(req.body);
    return res.status(200).json({
      status: "success",
      classList,
      classIdToUserIdMap: [...classIdToUserIdMap],
      userIdToNameMap: [...userIdToNameMap],
      userIdToEmailMap: [...userIdToEmailMap],
      userIdToRoleMap: [...userIdToRoleMap],
    });
  } catch (error) {
    next(error);
  }
};

// Change Role endpoint
const changeRole = async (req, res, next) => {
  try {
    await classroomService.change(req.body);
    return res.status(201).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export { createClass, getClassAndUserList, joinClass, changeRole };
