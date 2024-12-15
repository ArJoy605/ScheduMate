import {
  changeRoleDB,
  createClassDB,
  getClassAndUserListDB,
  joinClassDB,
} from "../db/classroom.db.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class ClassroomService {
  async create(classData) {
    const { class_name, user_id } = classData;

    if (!class_name) {
      throw new ErrorHandler(400, "Class name cannot be empty");
    }
    if (user_id === null) {
      throw new ErrorHandler(401, "Unauthorized. Please log in.");
    }

    const classInfo = await createClassDB(class_name, user_id);
    return classInfo;
  }

  async join(classData) {
    const { class_id, user_id } = classData;

    if (!class_id) {
      throw new ErrorHandler(400, "Class code cannot be empty");
    }
    if (user_id === null) {
      throw new ErrorHandler(401, "Unauthorized. Please log in.");
    }

    const userInfo = await joinClassDB(class_id, user_id);
    return userInfo;
  }

  async getList(userID) {
    const { user_id } = userID;

    if (user_id === null) {
      throw new ErrorHandler(401, "Unauthorized. Please log in.");
    }

    const classObject = await getClassAndUserListDB(user_id);
    return classObject;
  }

  async change(classData) {
    const { class_id, user_id, class_role } = classData;

    if (user_id === null || class_id === null) {
      throw new ErrorHandler(401, "Unauthorized. Please log in.");
    }

    await changeRoleDB(class_id, user_id, class_role);
  }
}

export default new ClassroomService();
