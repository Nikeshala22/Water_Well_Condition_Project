import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Styling for the horizontal links in the Top Bar
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200"
      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200";

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "block text-blue-600 bg-blue-50 px-4 py-3 rounded-lg text-base font-bold"
      : "block text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-4 py-3 rounded-lg text-base font-medium";

  return (
    <nav className="sticky top-0 z-60 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                className="text-blue-600 group-hover:text-blue-700 transition-colors"
              >
                <path d="M3 9l9-7 9 7" /><path d="M6 9v12" /><path d="M18 9v12" />
                <rect x="4" y="14" width="16" height="7" rx="1" />
                <path d="M12 2v9" /><path d="M10 11h4v3h-4z" />
              </svg>
              <span className="text-gray-900 font-extrabold text-xl tracking-tight">
                WellSync
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 mr-4">
                  {/* ADMIN LINKS */}
                  {user.role === "admin" && (
                    <>
                      <NavLink to="/admin" className={linkClass}>Admin Panel</NavLink>
                      <NavLink to="/wells" className={linkClass}>Manage Wells</NavLink>
                      <NavLink to="/reports" className={linkClass}>All Reports</NavLink>
                      <NavLink to="/lab-reports" className={linkClass}>Lab Sync</NavLink>
                    </>
                  )}

                  {/* FIELD OFFICER LINKS */}
                  {user.role === "field_officer" && (
                    <>
                      <NavLink to="/field-dashboard" className={linkClass}>Dashboard</NavLink>
                      <NavLink to="/reports" className={linkClass}>Reports</NavLink>
                      <NavLink to="/maintenance" className={linkClass}>Maintenance</NavLink>
                    </>
                  )}
                </div>

                {/* User Profile & Logout Section */}
                <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-100 px-2 py-1 rounded">
                    {user.role?.replace('_', ' ')}
                  </span>
                  <button
                    onClick={logout}
                    className="text-xs font-bold text-white bg-slate-900 hover:bg-black px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/signup" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-sm transition-all">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-500 p-2 rounded-md hover:bg-gray-100 transition-colors">
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-screen opacity-100 border-t" : "max-h-0 opacity-0"}`}>
        <div className="px-4 py-4 space-y-1 bg-white shadow-xl">
          {user ? (
            <>
              {user.role === "admin" ? (
                <>
                  <NavLink to="/admin" onClick={toggleMenu} className={mobileLinkClass}>Admin Panel</NavLink>
                  <NavLink to="/wells" onClick={toggleMenu} className={mobileLinkClass}>Wells</NavLink>
                  <NavLink to="/reports" onClick={toggleMenu} className={mobileLinkClass}>Reports</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/field-dashboard" onClick={toggleMenu} className={mobileLinkClass}>Dashboard</NavLink>
                  <NavLink to="/add-report" onClick={toggleMenu} className={mobileLinkClass}>Add New Report</NavLink>
                  <NavLink to="/reports" onClick={toggleMenu} className={mobileLinkClass}>History</NavLink>
                </>
              )}
              <button onClick={logout} className="w-full mt-4 text-white bg-slate-900 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Logout Session</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={toggleMenu} className={mobileLinkClass}>Login</NavLink>
              <NavLink to="/signup" onClick={toggleMenu} className="block w-full text-center text-white bg-blue-600 py-3 rounded-xl font-bold mt-2">Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;