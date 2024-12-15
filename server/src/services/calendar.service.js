import {
  createCalendarEventDB,
  createMultipleCalendarEventsDB,
  deleteCalendarEventDB,
  deleteMultipleCalendarEventsDB,
  fetchCalendarEventsDB,
} from "../db/calendar.db.js";

class CalendarService {
  async createMultiple(eventData) {
    const { class_id, events, dates } = eventData;
    const calendarEvents = await createMultipleCalendarEventsDB(
      class_id,
      events,
      dates
    );
    return calendarEvents;
  }

  async deleteMultiple(eventData) {
    const { class_id, dates } = eventData;
    await deleteMultipleCalendarEventsDB(class_id, dates);
  }

  async delete(eventData) {
    const { class_id, event_datetime } = eventData;
    await deleteCalendarEventDB(class_id, event_datetime);
  }

  async create(eventData) {
    const {
      class_id,
      instructor_id,
      event_name,
      event_type,
      event_description,
      event_datetime,
      is_routine,
    } = eventData;

    const calendarEvent = createCalendarEventDB(
      class_id,
      instructor_id,
      event_name,
      event_type,
      event_description,
      event_datetime,
      is_routine
    );

    return calendarEvent;
  }

  async fetch(classObj) {
    const { class_id } = classObj;

    const calendarEvents = await fetchCalendarEventsDB(class_id);

    return calendarEvents;
  }
}

export default new CalendarService();
