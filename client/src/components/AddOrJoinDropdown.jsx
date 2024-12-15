import { useState } from "react";
import { TfiPlus } from "react-icons/tfi";
import ClassCreationModal from "./ClassCreationModal";
import ClassJoinModal from "./ClassJoinModal";

export default function AddOrJoinDropdown() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <TfiPlus
        className="cursor-pointer text-blue-100 hover:text-blue-300 focus:text-blue-100"
        onClick={toggleDropdown}
      />
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <ul className="py-2 px-3 text-base text-slate-200">
            <ClassCreationModal />
            <ClassJoinModal />
          </ul>
        </div>
      )}
    </div>
  );
}
