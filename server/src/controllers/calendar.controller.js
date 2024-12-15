import calendarService from "../services/calendar.service.js";

// Create Multiple Calender Events endpoint
const createMultipleCalendarEvents = async (req, res, next) => {
  try {
    const calendarEvents = await calendarService.createMultiple(req.body);
    return res.status(201).json({ status: "success", calendarEvents });
  } catch (error) {
    next(error);
  }
};

// Create Calender Events endpoint
const createCalendarEvents = async (req, res, next) => {
  try {
    const calendarEvent = await calendarService.create(req.body);
    return res.status(201).json({ status: "success", calendarEvent });
  } catch (error) {
    next(error);
  }
};

// Delete Multiple Calender Events endpoint
const deleteMultipleCalendarEvents = async (req, res, next) => {
  try {
    await calendarService.deleteMultiple(req.body);
    return res.status(204).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

// Delete Calender Event endpoint
const deleteCalendarEvent = async (req, res, next) => {
  try {
    await calendarService.delete(req.body);
    return res.status(204).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

// Fetch Calendar Events endpoint
const fetchCalendarEvents = async (req, res, next) => {
  try {
    const calendarEvents = await calendarService.fetch(req.body);
    return res.status(200).json({ status: "success", calendarEvents });
  } catch (error) {
    next(error);
  }
};

export {
  createMultipleCalendarEvents,
  deleteMultipleCalendarEvents,
  fetchCalendarEvents,
  createCalendarEvents,
  deleteCalendarEvent,
};
