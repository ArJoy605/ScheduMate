import pool from "../configs/pool.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

const createClassDB = async (class_name, admin_id) => {
  try {
    const client = await pool.connect();

    // Batch update
    try {
      await client.query("BEGIN");

      const { rows: newClass } = await client.query(
        "INSERT INTO classes (class_name, admin_id) VALUES ($1, $2) RETURNING *",
        [class_name, admin_id]
      );
      await client.query(
        "INSERT INTO class_users (class_id, user_id, class_role) VALUES ($1, $2, $3)",
        [newClass[0].class_id, admin_id, "admin"]
      );

      await client.query("COMMIT");

      return newClass[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw new ErrorHandler(500, "An error occurred");
    } finally {
      client.release();
    }
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};

const joinClassDB = async (class_id, user_id) => {
  try {
    const { rows: newUser } = await pool.query(
      "INSERT INTO class_users (class_id, user_id) VALUES ($1, $2)",
      [class_id, user_id]
    );

    return newUser[0];
  } catch (error) {
    console.log(error);
    if (error.routine === "string_to_uuid") {
      throw new ErrorHandler(400, "Invalid code");
    }
    if (error.constraint === "class_users_class_id_fkey") {
      throw new ErrorHandler(404, "No class found");
    }
    if (error.constraint === "class_users_pkey") {
      throw new ErrorHandler(409, "Already joined");
    }
    throw new ErrorHandler(500, "An error occurred");
  }
};

const getClassAndUserListDB = async (user_id) => {
  try {
    const { rows: classList } = await pool.query(
      "SELECT * FROM classes, class_users WHERE user_id = $1 and classes.class_id = class_users.class_id",
      [user_id]
    );

    const classIds = classList.map((item) => item.class_id);
    const { rows: classUsers } = await pool.query(
      "SELECT class_id, user_id, class_role FROM class_users WHERE class_id = ANY($1)",
      [classIds]
    );

    const classIdToUserIdMap = new Map();
    classUsers.forEach((classUser) => {
      if (!classIdToUserIdMap.has(classUser.class_id)) {
        classIdToUserIdMap.set(classUser.class_id, []);
      }
      classIdToUserIdMap.get(classUser.class_id).push(classUser.user_id);
    });

    const userIdToRoleMap = new Map();

    classUsers.forEach((classUser) => {
      const key = JSON.stringify({
        class_id: classUser.class_id,
        user_id: classUser.user_id,
      });
      userIdToRoleMap.set(key, classUser.class_role);
    });

    const userIds = classUsers.map((item) => item.user_id);
    const { rows: nameIds } = await pool.query(
      "SELECT user_id, name FROM users WHERE user_id = ANY($1)",
      [userIds]
    );

    const userIdToNameMap = new Map(
      nameIds.map((nameId) => [nameId.user_id, nameId.name])
    );

    const { rows: emailIds } = await pool.query(
      "SELECT user_id, email FROM users WHERE user_id = ANY($1)",
      [userIds]
    );

    const userIdToEmailMap = new Map(
      emailIds.map((emailId) => [emailId.user_id, emailId.email])
    );

    return {
      classList,
      classIdToUserIdMap,
      userIdToNameMap,
      userIdToEmailMap,
      userIdToRoleMap,
    };
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};

const changeRoleDB = async (class_id, user_id, class_role) => {
  try {
    await pool.query(
      "UPDATE class_users SET class_role = $1 WHERE class_id = $2 and user_id = $3",
      [class_role, class_id, user_id]
    );
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};

export { createClassDB, getClassAndUserListDB, joinClassDB, changeRoleDB };
