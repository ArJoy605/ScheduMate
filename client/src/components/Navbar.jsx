import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useUserContext } from "../contexts/userContext";
import { FiHome } from "react-icons/fi";
import { AiOutlineLogin } from "react-icons/ai";
import { RiUserAddLine } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import UserDropdown from "./UserDropdown";
import AddOrJoinDropdown from "./AddOrJoinDropdown";
import NavbarDropdown from "./NavbarDropdown";

export default function Navbar() {
  const { isLoggedIn } = useAuthContext();
  const { userData } = useUserContext();

  return (
    <nav className="fixed w-full z-40 top-0 flex items-center text-lg py-2 px-3 font-medium border-b drop-shadow-xl bg-gray-900 text-blue-200 border-gray-800">
      <Link to="/" className="mr-5 flex items-center font-bold">
        <img
          src="./src/assets/logo.png"
          alt="logo"
          className="w-7 h-7 rounded-full"
        />
        <p className="text-white text-2xl">Schedu</p>
        <p className="text-[#54DAA8] text-lg">Mate</p>
      </Link>
      <Link to="/" className="mr-5 flex items-center">
        <FiHome className="mr-2" />
        Home
      </Link>
      {isLoggedIn === true && (
        <Link to="/classroom" className="mr-5 flex items-center">
          <SiGoogleclassroom className="mr-2" />
          Classroom
        </Link>
      )}
      <NavbarDropdown />
      {isLoggedIn === true ? (
        <>
          <div className="ml-auto mr-5">
            <AddOrJoinDropdown />
          </div>
          <div className="relative">
            <UserDropdown userName={userData && userData.name} />
          </div>
        </>
      ) : (
        <div className="flex ml-auto">
          <Link to="/login" className="mr-5 flex items-center">
            <AiOutlineLogin className="mr-2" />
            Login
          </Link>
          <Link to="/register" className="flex items-center">
            <RiUserAddLine className="mr-2" /> Register
          </Link>
        </div>
      )}
    </nav>
  );
}
