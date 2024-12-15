import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

export default function UserDropdown({ userName }) {
  const { logout } = useUserContext();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleBlur = () => {
    const id = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
    setTimerId(id);
  };

  const handleFocus = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  return (
    <div className="relative">
      <div
        className={`rounded-full w-10 h-10 bg-green-600 flex items-center justify-center text-white cursor-pointer hover:bg-green-500 ${
          isDropdownOpen ? "focus:ring focus:ring-slate-300" : ""
        }`}
        onClick={toggleDropdown}
        tabIndex="0"
        onBlur={handleBlur}
        onFocus={handleFocus}
      >
        {userName && userName[0]}
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <ul className="py-2 px-3 text-base text-slate-200">
            <li className="cursor-default text-center mb-3 text-green-300 border-b border-gray-700">
              {userName && userName}
            </li>
            <li className="cursor-pointer flex items-center mb-1">
              <FiUser className="mr-2" />
              Profile
            </li>
            <li className="cursor-pointer flex items-center mb-1">
              <FiSettings className="mr-2" />
              Settings
            </li>
            <li
              className="cursor-pointer flex items-center"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <FiLogOut className="mr-2" />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
