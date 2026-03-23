import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

import authRoutes from "./routes/authRoutes.js"; 
import reportRoutes from "./routes/wellReportRoutes.js";
import wellsRoutes from "./routes/wellsRoutes.js";
<<<<<<< HEAD
import waterQualityRoutes from "./routes/waterQualityRoutes.js";
import maintenanceRequestRoutes from "./routes/maintenanceRequestRoutes.js"; 

=======
>>>>>>> d9eb8a1aa76b90a7c345679610793cb082767644

//initialize express app
const app = express()

// connect database
await connectDB()

// Middelware
app.use(cors());
app.use(express.json());

//Routes
<<<<<<< HEAD
app.use("/api/wells", wellsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/water-quality", waterQualityRoutes);
app.use("/api/maintenance", maintenanceRequestRoutes);
app.use("/uploads", express.static("uploads"));


// app.get('/', (req, res)=> res.send("Server is running"))



if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
}

export default app;
=======
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/wells", wellsRoutes);


app.use("/uploads", express.static("uploads"));

app.get('/', (req, res)=> res.send("Server is running"))

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
>>>>>>> d9eb8a1aa76b90a7c345679610793cb082767644
