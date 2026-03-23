import jwt from "jsonwebtoken";
import User from "../models/User.js";

<<<<<<< HEAD
// 1. Authentication Check
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(401).json({ message: "User not found" });
=======
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

>>>>>>> d9eb8a1aa76b90a7c345679610793cb082767644
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

<<<<<<< HEAD
// 2. Flexible Authorization (REPLACE the hardcoded fieldOfficerOnly with this)
=======
// ===============================
// Role-based Access Control
// ===============================
>>>>>>> d9eb8a1aa76b90a7c345679610793cb082767644
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
<<<<<<< HEAD
        message: `Denied: ${req.user?.role} does not have access to ${req.originalUrl}`
=======
        message: "Access denied: insufficient permissions",
>>>>>>> d9eb8a1aa76b90a7c345679610793cb082767644
      });
    }
    next();
  };
<<<<<<< HEAD
};
=======
};

// fieldOfficerOnly middleware
const fieldOfficerOnly = (req, res, next) => {
  if (req.user && req.user.role === "field_officer") {
    next();
  } else {
    res.status(403).json({ message: "Access restricted to field officers only" });
  }
};
>>>>>>> d9eb8a1aa76b90a7c345679610793cb082767644
