import React from "react";
import { NavLink } from "react-router-dom";

const FieldOfficerSidebar = () => {
  const sidebarLinkClass = ({ isActive }) =>
    `block px-6 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-800 text-white border-l-4 border-white"
        : "text-blue-100 hover:bg-blue-700 hover:text-white"
    }`;

  return (
    <div className="w-64 bg-blue-600 min-h-screen shadow-lg hidden md:block">
      <div className="p-6">
        <h2 className="text-white text-2xl font-black uppercase tracking-tighter">
          Officer Panel
        </h2>
      </div>
      <nav className="mt-4">
        <NavLink to="/officer-dashboard" className={sidebarLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/add-report" className={sidebarLinkClass}>
          Add Report
        </NavLink>
        <NavLink to="/reports" className={sidebarLinkClass}>
          Reports
        </NavLink>
        <NavLink to="/water-quality" className={sidebarLinkClass}>
          Water Quality
        </NavLink>
        <NavLink to="/comments" className={sidebarLinkClass}>
          Comments
        </NavLink>
      </nav>
    </div>
  );
};

export default FieldOfficerSidebar;