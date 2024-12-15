import dayjs from "dayjs";
import { useState } from "react";
import { useCalendarContext } from "../contexts/calendarContext";
import { useClassroomContext } from "../contexts/classroomContext";
import { useUserContext } from "../contexts/userContext";

export default function EventsTab() {
  const { calendarEvents } = useCalendarContext();
  const { userIdToNameMap, focusedClass } = useClassroomContext();
  const { userData } = useUserContext();
  const [selectedOption, setSelectedOption] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [daysFor, setDaysFor] = useState("0");
  const [isChecked, setIsChecked] = useState(false);
  const currentDate = dayjs();
  const endDate = currentDate.add(daysFor, "day");
  const renderedEvents = [];

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  let current = dayjs(calendarEvents[1]?.event_datetime).format("YYYY-MM-DD");

  // renderedEvents.push(
  //   <>
  //     <div className="w-screen mt-5 flex">
  //       <p className="mr-2 font-semibold text-red-500">Date:</p>
  //       <p className="text-slate-300">{eventDate.format("YYYY-MM-DD")}</p>
  //       <div className="w-screen border-b border-gray-700"></div>
  //     </div>
  //   </>
  // );

  let x = true;
  for (let index = 1; index < calendarEvents.length; index++) {
    const event = calendarEvents[index];
    const eventDate = dayjs(event.event_datetime);

    if (
      eventDate.isAfter(endDate) &&
      (daysFor !== "0" ||
        currentDate.toDate().toDateString() !==
          eventDate.toDate().toDateString())
    ) {
      break;
    }

    if (eventDate.isBefore(currentDate)) {
      continue;
    }

    if (
      daysFor === "1" &&
      currentDate.toDate().toDateString() === eventDate.toDate().toDateString()
    ) {
      continue;
    }

    if (
      x &&
      selectedOption === "all" &&
      focusedClass.class_id === event.class_id &&
      (!isChecked || userData.user_id === event.instructor_id)
    ) {
      renderedEvents.push(
        <>
          <div className="w-screen mt-5 flex">
            <p className="mr-2 font-semibold text-red-500">Date:</p>
            <p className="text-slate-300">{eventDate.format("YYYY-MM-DD")}</p>
            <div className="w-screen border-b border-gray-700"></div>
          </div>
        </>
      );
      x = false;
    }

    if (
      current !== eventDate.format("YYYY-MM-DD") &&
      (selectedOption === "all" || selectedOption === event.event_type) &&
      focusedClass.class_id === event.class_id &&
      (!isChecked || userData.user_id === event.instructor_id)
    ) {
      renderedEvents.push(
        <>
          <div className="w-screen mt-5 flex">
            <p className="mr-2 font-semibold text-red-500">Date:</p>
            <p className="text-slate-300">{eventDate.format("YYYY-MM-DD")}</p>
            <div className="w-screen border-b border-gray-700"></div>
          </div>
        </>
      );
      current = eventDate.format("YYYY-MM-DD");
    }

    if (
      (selectedOption === "all" || selectedOption === event.event_type) &&
      focusedClass.class_id === event.class_id &&
      (!isChecked || userData.user_id === event.instructor_id)
    )
      renderedEvents.push(
        <>
          <div
            key={index}
            className="bg-gray-800 text-sm text-slate-300 border border-slate-600 rounded p-4 w-72 shadow-lg whitespace-nowrap"
          >
            <div className="overflow-x-scroll">
              <p className="text-green-400">
                Time: {eventDate.format("HH:mm:ss")}
              </p>
              <p>Name: {event.event_name}</p>
              <p>Description: {event.event_description}</p>
              <p>Instructor: {userIdToNameMap.get(event.instructor_id)}</p>
            </div>
          </div>
        </>
      );
  }

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleDaysChange = (e) => {
    setDaysFor(e.target.value);
  };

  return (
    <div>
      <div className="flex mb-8">
        <label className="flex items-center justify-center cursor-pointer ml-4">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 accent-gray-700"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2 text-slate-400 text-sm">
            Show only the ones you teach
          </span>
        </label>
        <div className="flex rounded-full border border-gray-600 px-2 ml-auto justify-center items-center text-sm text-gray-300 font-semibold">
          {expanded && (
            <p
              className="ml-1 text-sm text-slate-400 font-normal"
              onClick={toggleExpand}
            >
              {focusedClass.class_id}
            </p>
          )}
          <button
            onClick={toggleExpand}
            className="ml-1 text-sm text-slate-400 font-normal focus:outline-none"
          >
            {expanded ? "" : "Click to show class code"}
          </button>
        </div>
        <select
          className="ml-auto text-sm bg-bgcolor p-2 w-28 text-slate-300 focus:outline-none border-b-2 border-slate-600 focus:border-slate-400 mr-5"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="all">All</option>
          <option value="class">Classes</option>
          <option value="exam">Exams</option>
          <option value="assignment">Assignments</option>
          <option value="other">Others</option>
        </select>

        <select
          className="text-sm bg-bgcolor p-2 w-28 text-slate-300 focus:outline-none border-b-2 border-slate-600 focus:border-slate-400 mr-3"
          value={daysFor}
          onChange={handleDaysChange}
        >
          <option value={0}>Today</option>
          <option value={1}>Tomorrow</option>
          <option value={3}>3 days</option>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-5 w-[79vw]">{renderedEvents}</div>
    </div>
  );
}
