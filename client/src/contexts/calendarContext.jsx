import API from "../api/axios.config";
import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useClassroomContext } from "./classroomContext";

const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const { focusedClass } = useClassroomContext();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isCalendarEventChanged, setIsCalendarEventChanged] = useState(false);

  useEffect(() => {
    if (focusedClass) {
      API.post("/classroom/calendar/fetch", {
        class_id: focusedClass.class_id,
      }).then((res) => {
        if (res?.data.calendarEvents.length > 0) {
          setCalendarEvents([calendarEvents, ...res.data.calendarEvents]);
          setIsCalendarEventChanged(false);
        }
      });
    }
  }, [focusedClass, isCalendarEventChanged]);

  return (
    <CalendarContext.Provider
      value={{
        calendarEvents,
        setIsCalendarEventChanged,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

const useCalendarContext = () => {
  const context = useContext(CalendarContext);

  if (context === undefined) {
    throw new Error(
      "useCalendarContext must be used within CalendarContextProvider"
    );
  }
  return context;
};

export { CalendarContextProvider, useCalendarContext };
