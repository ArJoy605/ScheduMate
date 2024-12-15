import pool from "../configs/pool.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

const createRoutineEventDB = async (
  class_id,
  instructor_id,
  event_name,
  event_description,
  event_type,
  event_day,
  event_time,
  event_endtime
) => {
  try {
    const { rows: startEndTime } = await pool.query(
      "SELECT event_time, event_endtime FROM routine_events WHERE class_id = $1 and event_day = $2",
      [class_id, event_day]
    );

    console.log(startEndTime);

    startEndTime.forEach((item) => {
      if (item.event_time <= event_time && item.event_endtime >= event_time) {
        throw "range error";
      }
      if (
        item.event_time <= event_endtime &&
        item.event_endtime >= event_endtime
      ) {
        throw "range error";
      }
    });

    const { rows: routineEvents } = await pool.query(
      "INSERT INTO routine_events VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        class_id,
        instructor_id,
        event_name,
        event_description,
        event_type,
        event_day,
        event_time,
        event_endtime,
      ]
    );

    return routineEvents;
  } catch (error) {
    // console.log(error);
    if (error === "range error") {
      throw new ErrorHandler(409, "Event conflicts with another event");
    }
    if (error.routine === "DateTimeParseError") {
      throw new ErrorHandler(400, "Invalid time format");
    }
    if (error.constraint === "routine_events_pkey") {
      throw new ErrorHandler(409, "Event already exists");
    }
    throw new ErrorHandler(500, "An error occurred");
  }
};

const fetchRoutineEventsDB = async (class_id) => {
  try {
    const { rows: routineEvents } = await pool.query(
      "SELECT * FROM routine_events WHERE class_id = $1 ORDER BY event_time",
      [class_id]
    );
    return routineEvents;
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};

const deleteRoutineEventDB = async (
  class_id,
  datetimes,
  event_day,
  event_time
) => {
  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const datetime of datetimes) {
        await client.query(
          "DELETE FROM calendar_events WHERE class_id = $1 and event_datetime = $2 and is_routine = TRUE;",
          [class_id, datetime]
        );
      }

      await client.query(
        "DELETE FROM routine_events WHERE class_id = $1 and event_day = $2 and event_time = $3;",
        [class_id, event_day, event_time]
      );

      await client.query("COMMIT");
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

export { createRoutineEventDB, fetchRoutineEventsDB, deleteRoutineEventDB };
