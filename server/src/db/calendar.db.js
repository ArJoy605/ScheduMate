import pool from "../configs/pool.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

const createMultipleCalendarEventsDB = async (class_id, events, dates) => {
  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const date of dates) {
        await client.query(
          "DELETE FROM calendar_events WHERE class_id = $1 and DATE(event_datetime) = $2 and is_routine = true;",
          [class_id, date]
        );
      }

      const calendarEvents = [];

      for (const event of events) {
        const { rows: calendarEvent } = await client.query(
          `
        INSERT INTO calendar_events (class_id, instructor_id, event_name, event_type, event_description, event_datetime, is_routine)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (class_id, event_datetime) DO UPDATE
        SET
          instructor_id = EXCLUDED.instructor_id,
          event_name = EXCLUDED.event_name,
          event_type = EXCLUDED.event_type,
          event_description = EXCLUDED.event_description,
          is_routine = EXCLUDED.is_routine;
      `,
          [
            event.class_id,
            event.instructor_id,
            event.event_name,
            event.event_type,
            event.event_description,
            event.event_datetime,
            event.is_routine,
          ]
        );
        calendarEvents.push(calendarEvent[0]);
      }

      await client.query("COMMIT");

      return calendarEvents;
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

const deleteMultipleCalendarEventsDB = async (class_id, dates) => {
  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const date of dates) {
        await client.query(
          "DELETE FROM calendar_events WHERE class_id = $1 and DATE(event_datetime) = $2;",
          [class_id, date]
        );
      }

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

const deleteCalendarEventDB = async (class_id, event_datetime) => {
  try {
    await pool.query(
      "DELETE FROM calendar_events WHERE class_id = $1 and event_datetime = $2;",
      [class_id, event_datetime]
    );
  } catch (error) {
    throw new ErrorHandler(500, "An error occurred");
  }
};

const fetchCalendarEventsDB = async (class_id) => {
  try {
    const { rows: calendarEvents } = await pool.query(
      "SELECT * FROM calendar_events WHERE class_id = $1 ORDER BY event_datetime",
      [class_id]
    );
    return calendarEvents;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, "An error occurred");
  }
};

const createCalendarEventDB = async (
  class_id,
  instructor_id,
  event_name,
  event_type,
  event_description,
  event_datetime,
  is_routine
) => {
  try {
    const { rows: calendarEvent } = await pool.query(
      "INSERT INTO calendar_events (class_id, instructor_id, event_name, event_type, event_description, event_datetime, is_routine) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [
        class_id,
        instructor_id,
        event_name,
        event_type,
        event_description,
        event_datetime,
        is_routine,
      ]
    );

    return calendarEvent;
  } catch (error) {
    console.log(error);
    if (error.routine === "DateTimeParseError") {
      throw new ErrorHandler(400, "Invalid time format");
    }
    if (error.constraint === "calendar_events_pkey") {
      throw new ErrorHandler(409, "Event already exists");
    }
    throw new ErrorHandler(500, "An error occurred");
  }
};

export {
  createMultipleCalendarEventsDB,
  deleteMultipleCalendarEventsDB,
  fetchCalendarEventsDB,
  createCalendarEventDB,
  deleteCalendarEventDB,
};
