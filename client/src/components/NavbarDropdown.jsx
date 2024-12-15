import { CgMoreO } from "react-icons/cg";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  FaQuestionCircle,
  FaInfoCircle,
  FaBlog,
  FaUserTie,
  FaAddressCard,
} from "react-icons/fa";

export default function NavbarDropdown() {
  return (
    <div className="relative group">
      <div className="flex cursor-pointer text-blue-200 items-center justify-center">
        <CgMoreO className="mr-2" />
        <p>More</p>
        <IoMdArrowDropdown className="text-gray-500 mt-1 ml-1" />
      </div>

      <div className="invisible mt-2 group-hover:visible absolute left-0 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg transition-all">
        <ul className="py-2 px-3 text-base text-slate-200">
          <li className="cursor-pointer flex items-center mb-1">
            <FaInfoCircle className="mr-2" />
            About
          </li>
          <li className="cursor-pointer flex items-center mb-1">
            <FaBlog className="mr-2" />
            Blog
          </li>
          <li className="cursor-pointer flex items-center mb-1">
            <FaQuestionCircle className="mr-2" />
            FAQ
          </li>
          <li className="cursor-pointer flex items-center mb-1">
            <FaUserTie className="mr-2" />
            Staff
          </li>
          <li className="cursor-pointer flex items-center mb-1">
            <FaAddressCard className="mr-2" />
            Contact
          </li>
        </ul>
      </div>
    </div>
  );
}
