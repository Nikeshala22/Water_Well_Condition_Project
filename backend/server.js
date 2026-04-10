import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/wellReportRoutes.js";
import wellsRoutes from "./routes/wellsRoutes.js";
import waterQualityRoutes from "./routes/waterQualityRoutes.js";
import maintenanceRequestRoutes from "./routes/maintenanceRequestRoutes.js";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

// initialize express app
const app = express();

// connect database
await connectDB();

// ==========================
// CORS CONFIGURATION
// ==========================
const allowedOrigins = [
  "https://water-well-condition-project.vercel.app",
  "https://water-well-condition-project-70bbtugf3.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

// ==========================
// Middleware
// ==========================
app.use(express.json());

// ==========================
// Routes
// ==========================
app.use("/api/wells", wellsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/water-quality", waterQualityRoutes);
app.use("/api/maintenance", maintenanceRequestRoutes);

// Static files
app.use("/uploads", express.static("uploads"));

// Optional test route
// app.get('/', (req, res) => res.send("Server is running"));

// ==========================
// Start server
// ==========================
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

export default app;