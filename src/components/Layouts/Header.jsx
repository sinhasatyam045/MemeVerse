import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/store";
import smile from "../../../public/smile.png";

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
          className="w-8 h-8 md:w-12 md:h-12 absolute -left-4 md:-left-6 -top-1 md:-top-2 z-10"
        />
        <Link
          to="/"
          className="text-2xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text hover:scale-105 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-80 relative z-20 ml-4 md:ml-6"
        >
          MemeVerse
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Navigation Links - Desktop */}
      <nav className="hidden lg:flex gap-6 text-lg font-medium">
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
      <div className="hidden lg:flex gap-4">
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

      {/* Mobile Menu - Collapsible */}
      <div
        className={`${
          mobileMenuOpen ? "flex" : "hidden"
        } lg:hidden flex-col w-full absolute top-16 left-0 right-0 z-50 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } shadow-lg p-4`}
      >
        <nav className="flex flex-col gap-3 text-lg font-medium mb-4">
          <Link
            to="/explore"
            className="hover:text-cyan-500 transition-all duration-300 p-2 border-b border-gray-200 dark:border-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            to="/leaderboard"
            className="hover:text-cyan-500 transition-all duration-300 p-2 border-b border-gray-200 dark:border-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Leaderboard
          </Link>
          <Link
            to="/upload"
            className="hover:text-cyan-500 transition-all duration-300 p-2 border-b border-gray-200 dark:border-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Upload
          </Link>
        </nav>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              dispatch(toggleTheme());
              setMobileMenuOpen(false);
            }}
            className="cursor-pointer px-4 py-2 rounded-md border border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white hover:scale-105 dark:hover:text-black"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>

          <Link
            to="/profile"
            className="cursor-pointer px-4 py-2 text-center hover:scale-105 rounded-md border border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white dark:hover:text-black"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;