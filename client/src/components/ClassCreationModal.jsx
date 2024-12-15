import API from "../api/axios.config";
import { useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { useClassroomContext } from "../contexts/classroomContext";
import { IoCloseCircle } from "react-icons/io5";
import { MdOutlineAddCard } from "react-icons/md";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClassCreationModal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [class_name, setClassName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { userData } = useUserContext();
  const { setIsClassAdded } = useClassroomContext();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    setClassName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user_id = userData.user_id;
    API.post("/classroom/create", { class_name, user_id })
      .then(function () {
        setClassName({});
        toast.success("Class created successfully", {
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
        setIsClassAdded(true);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <>
      <div
        className="inline-flex items-center text-slate-200"
        onClick={openModal}
      >
        <MdOutlineAddCard className="cursor-pointer" />
        <p className="ml-2 cursor-pointer">Create class</p>
      </div>

      {isModalOpen && (
        <div className="h-screen w-screen fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-800 p-2 rounded-lg shadow-lg w-96">
            <div className="flex">
              <h2 className="text-xl font-semibold text-blue-300 p-3 mb-1">
                Create class
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
                  Class Name
                </label>
                <div className="relative mb-4 flex items-center">
                  <input
                    type="text"
                    className="text-sm bg-bgcolor placeholder-gray-700 p-2 w-full focus:outline-none focus:border-b-2 focus:border-blue-300"
                    placeholder="Enter class name"
                    onChange={handleInputChange}
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-500 mb-3">{errorMessage}</p>
                )}
              </div>
              <button
                type="submit"
                className="mx-auto my-4 rounded-sm px-4 h-9 w-20 flex items-center justify-center bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-500"
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
