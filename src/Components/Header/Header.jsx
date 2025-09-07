import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";


function Header({ title = "Question Generator", onLogout }) {
  return (
    <div className="w-full flex items-center justify-between bg-[#71C9CE] p-3 shadow-md">
      
      {/* Home Icon */}
      <Link to={"/questions"} className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
          className="w-8 h-8 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </Link>

      {/* Title */}
      <h1 className="flex-1 text-center text-3xl font-semibold text-white font-sans">
        {title}
      </h1>

      {/* Logout Button */}
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
}

export default Header;
