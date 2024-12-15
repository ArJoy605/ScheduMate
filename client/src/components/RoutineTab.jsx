import API from "../api/axios.config";
import dayjs from "dayjs";
import RoutineEventCreationModal from "../components/RoutineEventCreationModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useClassroomContext } from "../contexts/classroomContext";
import { useRoutineContext } from "../contexts/routineContext";
import { useCalendarContext } from "../contexts/calendarContext";
import { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RoutineTab() {
  const { focusedClass, userIdToNameMap } = useClassroomContext();
  const {
    days,
    selectedDay,
    setSelectedDay,
    routineEvents,
    setIsRoutineEventChanged,
  } = useRoutineContext();
  const { setIsCalendarEventChanged, calendarEvents } = useCalendarContext();
  const [formData, setFormData] = useState({
    startingDate: "",
    endingDate: "",
  });
  const [eventTime, setEventTime] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const events = [];
  const dates = [];
  const datetimes = [];

  const openAlert = (event_time) => {
    setEventTime(event_time);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleConfirm = () => {
    deleteEvent(selectedDay, eventTime);
    closeAlert();
  };

  let routine = new Map();

  routineEvents.forEach((event) => {
    const { event_day } = event;
    if (routine.has(event_day)) {
      routine.get(event_day).push(event);
    } else {
      routine.set(event_day, [event]);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { startingDate, endingDate } = formData;

    const start = dayjs(startingDate);
    const end = dayjs(endingDate);
    const diff = end.diff(start, "day");

    if (!startingDate || !endingDate) {
      setErrorMessage("Invalid input. Dates cannot be empty.");
    } else if (end.isBefore(start)) {
      setErrorMessage("Invalid input (end < start).");
    } else if (end.diff(start, "month", true) > 24) {
      setErrorMessage("Limit is 24 months");
    } else {
      setErrorMessage("");

      dates.length = 0;
      events.length = 0;
      for (let i = start.date(); i <= start.date() + diff; i++) {
        const event = routine.get(days[start.date(i).day()]);

        dates.push(start.date(i).format("YYYY-MM-DD"));

        if (event) {
          event.map((item) => {
            const timeStamp =
              start.date(i).format("YYYY-MM-DD ") + item.event_time;

            events.push({
              class_id: item.class_id,
              instructor_id: item.instructor_id,
              event_name: item.event_name,
              event_description: item.event_description,
              event_type: item.event_type,
              event_datetime: timeStamp,
              is_routine: true,
            });
          });
        }
      }

      API.post("/classroom/calendar/createMultiple", {
        class_id: focusedClass.class_id,
        events,
        dates,
      })
        .then(function () {
          setFormData({
            startingDate: "",
            endingDate: "",
          });
          setIsCalendarEventChanged(true);
          toast.success("Events added successfully", {
            position: toast.POSITION.BOTTOM_RIGHT,
            theme: "dark",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            transition: Slide,
          });
        })
        .catch(function (error) {
          setErrorMessage(error.response.data.message);
        });
    }
  };

  const deleteEvent = (day, event_time) => {
    const event_day = days[day];

    datetimes.length = 0;
    calendarEvents.forEach((event) => {
      const { event_datetime } = event;
      const datetime = dayjs(event_datetime);

      if (
        datetime.day() === day &&
        datetime.format("HH:mm:ss") === event_time
      ) {
        datetimes.push(datetime.format("YYYY-MM-DD HH:mm:ss"));
      }
    });

    API.post("/classroom/routine/delete", {
      datetimes,
      class_id: focusedClass.class_id,
      event_day,
      event_time,
    })
      .then(function () {
        toast.success("Event deleted successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "dark",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        });
        setIsCalendarEventChanged(true);
        setIsRoutineEventChanged(true);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <>
      <div className="flex mx-auto justify-center items-center h-[72vh] w-92 scale-110">
        <div className="divide-x-2 divide-gray-800 gap-6 grid grid-cols-2">
          <div className="cursor-pointer">
            {days.map((day, index) => {
              return (
                <div
                  className={`${
                    day === days[selectedDay]
                      ? "bg-slate-700"
                      : "hover:bg-slate-800"
                  }`}
                >
                  <h1
                    key={index}
                    className="h-[3.4rem] py-3 pl-2 text-xl font-semibold text-slate-200 border-b border-gray-800"
                    onClick={() => {
                      setSelectedDay(index);
                    }}
                  >
                    {day}
                  </h1>
                </div>
              );
            })}
          </div>
          <div className="w-96 h-96 pl-4 overflow-auto">
            <div className="flex mb-3 font-semibold">
              Schedule for
              <h1 className="ml-2 text-cyan-300">{days[selectedDay]}</h1>
            </div>
            {routine.get(days[selectedDay]) &&
              routine.get(days[selectedDay]).map(
                (event, index) =>
                  event.class_id === focusedClass.class_id && (
                    <div className="bg-gray-800 mb-3 text-sm text-slate-300 border border-slate-600 rounded p-3 w-72 shadow-lg whitespace-nowrap">
                      <div className="flex overflow-x-scroll">
                        <li key={index} className="text-xs">
                          <p className="text-green-400 font-semibold">
                            Start time: {event.event_time}
                          </p>
                          <p className="text-red-500 font-semibold">
                            End time: {event.event_endtime}
                          </p>
                          <p>Name: {event.event_name}</p>
                          <p>Description: {event.event_description}</p>
                          <p>Type: {event.event_type}</p>
                          <p>
                            Instructor:{" "}
                            {userIdToNameMap.get(event.instructor_id)}
                          </p>
                        </li>
                        {focusedClass &&
                          focusedClass.class_role === "admin" && (
                            <RiDeleteBin5Line
                              className="flex ml-auto mt-1 cursor-pointer text-red-500"
                              onClick={() => openAlert(event.event_time)}
                            />
                          )}
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
      <div>
        {focusedClass && focusedClass.class_role === "admin" && (
          <div className="ml-3">
            <form className="w-auto" onSubmit={handleSubmit} noValidate>
              <div className="inline-flex w-2/3 items-center justify-start">
                <label
                  htmlFor="startingDate"
                  className="text-xs font-semibold text-slate-300 mr-2"
                >
                  From:
                </label>
                <input
                  type="date"
                  name="startingDate"
                  className="text-xs bg-bgcolor py-2 w-28 border-b-2 border-slate-600 focus:outline-none focus:border-slate-400 mr-5"
                  onChange={handleInputChange}
                  value={formData.startingDate}
                />
                <label
                  htmlFor="endingDate"
                  className="text-xs font-semibold text-slate-300 mr-2"
                >
                  To:
                </label>
                <input
                  type="date"
                  name="endingDate"
                  className="text-xs bg-bgcolor py-2 w-28 border-b-2 border-slate-600 focus:outline-none focus:border-slate-400 mr-5"
                  onChange={handleInputChange}
                  value={formData.endingDate}
                />
                <button
                  type="submit"
                  className="w-fit h-fit text-xs flex items-center justify-center bg-blue-900 text-white mt-3 py-2 px-4 rounded-sm hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Add to calendar
                </button>
                {errorMessage && (
                  <p className="text-xs pt-3 ml-5 text-red-500">
                    {errorMessage}
                  </p>
                )}
              </div>
            </form>
            <div>
              <RoutineEventCreationModal />
            </div>
          </div>
        )}
      </div>
      {showAlert && (
        <ConfirmationModal
          header="Warning!"
          content="Event will be removed"
          onClose={closeAlert}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
