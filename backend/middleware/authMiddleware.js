import jwt from "jsonwebtoken";
import User from "../models/User.js";

<<<<<<< HEAD
// Protect routes (logged-in users)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

=======
// 1. Authentication Check
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(401).json({ message: "User not found" });
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

<<<<<<< HEAD
// ===============================
// Role-based Access Control
// ===============================
=======
// 2. Flexible Authorization (REPLACE the hardcoded fieldOfficerOnly with this)
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
<<<<<<< HEAD
        message: "Access denied: insufficient permissions",
=======
        message: `Denied: ${req.user?.role} does not have access to ${req.originalUrl}`
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
      });
    }
    next();
  };
<<<<<<< HEAD
};

// fieldOfficerOnly middleware
const fieldOfficerOnly = (req, res, next) => {
  if (req.user && req.user.role === "field_officer") {
    next();
  } else {
    res.status(403).json({ message: "Access restricted to field officers only" });
  }
};

=======
};
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
