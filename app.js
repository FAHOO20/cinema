import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/user-router.js";
import movieRouter from "./routes/movie-router.js";
import bookingsRouter from "./routes/booking-router.js";
import { addMoviesAutomatically } from "./controller/movie-controller.js"; // Import function

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected To Database");
    await addMoviesAutomatically(); // Add movies on startup
    app.listen(5000, () => console.log("Server is running"));
  })
  .catch((e) => console.log(e));
