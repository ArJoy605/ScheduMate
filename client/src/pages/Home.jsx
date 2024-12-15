import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

export default function Home() {
  const { isLoggedIn } = useAuthContext();

  return (
    <div
      className={`bg-cover bg-no-repeat mt-10 min-h-[703px] bg-[url("./assets/home.png")] relative`}
    >
      <div className="absolute left-[180px] bottom-[41px] ml-4 mb-4">
        <Link to={isLoggedIn ? "/classroom" : "/register"}>
          <button className="rounded-full px-4 py-2 bg-green-700 text-slate-100 text-xl font-semibold hover:bg-green-600">
            Start now
          </button>
        </Link>
      </div>
    </div>
  );
}
