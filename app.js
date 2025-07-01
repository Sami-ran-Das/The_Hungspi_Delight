import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from './database/dbConnection.js';
import reservationRouter from './routes/reservationRoute.js';
import { errorMiddleware } from './middlewares/error.js';

dotenv.config();

const app = express();

// Connect to database
dbConnection();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, etc.)
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/reservation", reservationRouter);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});