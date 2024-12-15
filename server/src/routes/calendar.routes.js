import express from "express";
import {
  createMultipleCalendarEvents,
  createCalendarEvents,
  deleteMultipleCalendarEvents,
  fetchCalendarEvents,
  deleteCalendarEvent,
} from "../controllers/calendar.controller.js";

const calendarRouter = express.Router();

calendarRouter.post(
  "/classroom/calendar/createMultiple",
  createMultipleCalendarEvents
);
calendarRouter.post("/classroom/calendar/create", createCalendarEvents);
calendarRouter.post(
  "/classroom/calendar/deleteMultiple",
  deleteMultipleCalendarEvents
);
calendarRouter.post("/classroom/calendar/delete", deleteCalendarEvent);
calendarRouter.post("/classroom/calendar/fetch", fetchCalendarEvents);

export default calendarRouter;
