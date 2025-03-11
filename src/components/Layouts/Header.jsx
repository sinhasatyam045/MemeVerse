import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/store";
import smile from "../../../public/smile.png";

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);

  return (
    <header
      className={`p-4 flex justify-between items-center border-b transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-black border-gray-300"
      }`}
    >
      {/* Logo with Overlapping Image */}
      <div className="relative flex items-center ml-5">
        <img
          src={smile}
          alt="smile"
          className="w-12 h-12 absolute -left-6 -top-2 z-10"
        />
        <Link
          to="/"
          className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text hover:scale-105 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-80 relative z-20 ml-6"
        >
          MemeVerse
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-6 text-lg font-medium">
        <Link
          to="/explore"
          className="hover:text-cyan-500 transition-all duration-300"
        >
          Explore
        </Link>
        <Link
          to="/leaderboard"
          className="hover:text-cyan-500 transition-all duration-300"
        >
          Leaderboard
        </Link>
        <Link
          to="/upload"
          className="hover:text-cyan-500 transition-all duration-300"
        >
          Upload
        </Link>
      </nav>

      {/* Theme Toggle & Profile */}
      <div className="flex gap-4">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="cursor-pointer px-4 py-2 rounded-md border border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white hover:scale-105 dark:hover:text-black"
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        <Link
          to="/profile"
          className="cursor-pointer px-4 py-2 hover:scale-105 rounded-md border border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white dark:hover:text-black"
        >
          Profile
        </Link>
      </div>
    </header>
  );
};

export default Header;
