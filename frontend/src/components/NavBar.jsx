import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200";

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "block text-blue-600 bg-blue-50 px-4 py-3 rounded-lg text-base font-medium transition-colors"
      : "block text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-4 py-3 rounded-lg text-base font-medium transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              {/* Custom SVG Well Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-blue-600 group-hover:text-blue-700 transition-colors"
              >
                {/* Roof */}
                <path d="M3 9l9-7 9 7" />
                {/* Pillars */}
                <path d="M6 9v12" />
                <path d="M18 9v12" />
                {/* Base */}
                <rect x="4" y="14" width="16" height="7" rx="1" />
                {/* Rope and Bucket */}
                <path d="M12 2v9" />
                <path d="M10 11h4v3h-4z" />
              </svg>
              <span className="text-gray-900 font-extrabold text-xl tracking-tight group-hover:text-blue-600 transition-colors">
                WellSync
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <div className="flex items-center space-x-1 mr-4">
                  <NavLink to="/wells" className={linkClass}>Wells</NavLink>
                  <NavLink to="/reports" className={linkClass}>Report</NavLink>
                  <NavLink to="/lab-reports" className={linkClass}>Lab Report</NavLink>
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white shadow-lg">
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={toggleMenu} className={mobileLinkClass}>Dashboard</NavLink>
              <NavLink to="/wells" onClick={toggleMenu} className={mobileLinkClass}>Wells</NavLink>
              <NavLink to="/reports" onClick={toggleMenu} className={mobileLinkClass}>Reports</NavLink>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="w-full text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-base font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={toggleMenu} className={mobileLinkClass}>Login</NavLink>
              <div className="pt-2">
                <NavLink 
                  to="/signup" 
                  onClick={toggleMenu}
                  className="block w-full text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-base font-medium transition-colors"
                >
                  Sign Up
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;