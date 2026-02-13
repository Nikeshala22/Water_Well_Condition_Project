import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

import authRoutes from "./routes/authRoutes.js"; 
import reportRoutes from "./routes/wellReportRoutes.js";

//initialize express app
const app = express()

// connect database
await connectDB()

// Middelware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

app.use("/uploads", express.static("uploads"));

app.get('/', (req, res)=> res.send("Server is running"))

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))