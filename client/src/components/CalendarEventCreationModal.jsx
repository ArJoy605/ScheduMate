import API from "../api/axios.config";
import routineIcon from "../assets/routine.png";
import { useClassroomContext } from "../contexts/classroomContext";
import { useCalendarContext } from "../contexts/calendarContext";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CalendarEventCreationModal() {
  const { focusedClass, classIdToUserIdMap, userIdToNameMap } =
    useClassroomContext();
  const { selectedDate, setIsCalendarEventChanged } = useCalendarContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    event_time: null,
    event_name: null,
    event_description: null,
    event_type: "class",
    instructor_id: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      event_time,
      event_name,
      event_description,
      event_type,
      instructor_id,
    } = formData;
    const class_id = focusedClass.class_id;
    const event_datetime = selectedDate.format("YYYY-MM-DD ") + event_time;

    console.log(event_datetime);

    API.post("/classroom/calendar/create", {
      class_id,
      event_datetime,
      event_name,
      event_description,
      event_type,
      instructor_id,
      is_routine: false,
    })
      .then(function () {
        setFormData({
          event_time: null,
          event_name: null,
          event_description: null,
          event_type: "class",
          instructor_id: null,
        });
        toast.success("Event created successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "dark",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        });
        closeModal();
        setIsCalendarEventChanged(true);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <>
      <img
        src={routineIcon}
        alt="Add/Edit"
        className="h-10 absolute bottom-0 right-0 mb-10 mr-10 p-1 rounded-md cursor-pointer hover:ring hover:ring-slate-500"
        onClick={openModal}
      />
      {isModalOpen && (
        <div className="h-screen w-screen fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-800 p-2 rounded-lg shadow-lg w-96">
            <div className="flex">
              <h2 className="text-md font-semibold text-blue-300 p-3 mb-1">
                Create routine event for {selectedDate.toDate().toDateString()}
              </h2>
              <div className="flex ml-auto">
                <IoCloseCircle
                  className="text-red-600 hover:text-red-500 focus:text-red-600"
                  onClick={closeModal}
                />
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-3">
                <label className="block text-blue-200 text-sm mb-2">
                  Time (e.g. 22:45:00)
                </label>
                <div className="relative mb-4 flex items-center">
                  <input
                    type="text"
                    name="event_time"
                    value={formData.event_time}
                    className="text-sm bg-bgcolor placeholder-gray-700 p-2 w-full focus:outline-none focus:border-b-2 focus:border-blue-300"
                    placeholder="Enter event time"
                    onChange={handleInputChange}
                  />
                </div>
                <label className="block text-blue-200 text-sm mb-2">Name</label>
                <div className="relative mb-4 flex items-center">
                  <input
                    type="text"
                    name="event_name"
                    value={formData.event_name}
                    className="text-sm bg-bgcolor placeholder-gray-700 p-2 w-full focus:outline-none focus:border-b-2 focus:border-blue-300"
                    placeholder="Enter event name"
                    onChange={handleInputChange}
                  />
                </div>
                <label className="block text-blue-200 text-sm mb-2">
                  Description
                </label>
                <div className="relative mb-4 flex items-center">
                  <textarea
                    name="event_description"
                    value={formData.event_description}
                    className="text-sm bg-bgcolor placeholder-gray-700 p-2 w-full h-24 resize-none focus:outline-none focus:border-b-2 focus:border-blue-300"
                    placeholder="Enter event description"
                    onChange={handleInputChange}
                  />
                </div>
                <label className="block text-blue-200 text-sm mb-2">Type</label>
                <div className="relative mb-4 flex items-center">
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleInputChange}
                    className="text-sm bg-bgcolor p-2 w-full focus:outline-none focus:border-b-2 focus:border-blue-300"
                  >
                    <option value="class">Class</option>
                    <option value="exam">Exam</option>
                    <option value="assignment">Assignment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <label className="block text-blue-200 text-sm mb-2">
                  Instructor
                </label>
                <div className="relative mb-4 flex items-center">
                  <select
                    name="instructor_id"
                    value={formData.instructor_id}
                    onChange={handleInputChange}
                    className="text-sm bg-bgcolor p-2 w-full focus:outline-none focus:border-b-2 focus:border-blue-300"
                  >
                    <option value="" selected>
                      Select an instructor
                    </option>
                    {classIdToUserIdMap.get(focusedClass.class_id).map((id) => (
                      <option value={id}>{userIdToNameMap.get(id)}</option>
                    ))}
                  </select>
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-500 mb-3">{errorMessage}</p>
                )}
              </div>
              <button
                type="submit"
                className="mx-auto my-6 rounded-sm px-4 h-9 w-20 flex items-center justify-center bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-500"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
