import API from "../api/axios.config";
import { createContext, useContext, useEffect, useState } from "react";
import { useClassroomContext } from "./classroomContext";

const RoutineContext = createContext();

const RoutineContextProvider = ({ children }) => {
  const { focusedClass } = useClassroomContext();
  const [selectedDay, setSelectedDay] = useState(0);
  const [routineEvents, setRoutineEvents] = useState([]);
  const [isRoutineEventChanged, setIsRoutineEventChanged] = useState(false);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    if (focusedClass) {
      API.post("/classroom/routine/fetch", {
        class_id: focusedClass.class_id,
      }).then((res) => {
        if (res?.data.routineEvents.length > 0) {
          setRoutineEvents([routineEvents, ...res.data.routineEvents]);
          setIsRoutineEventChanged(false);
        }
      });
    }
  }, [focusedClass, isRoutineEventChanged]);

  return (
    <RoutineContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        days,
        routineEvents,
        setIsRoutineEventChanged,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};

const useRoutineContext = () => {
  const context = useContext(RoutineContext);

  if (context === undefined) {
    throw new Error(
      "useRoutineContext must be used within RoutineContextProvider"
    );
  }
  return context;
};

export { RoutineContextProvider, useRoutineContext };
