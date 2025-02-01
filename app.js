// app.js
import express from "express";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/user-router.js";
import movieRouter from "./routes/movie-router.js";
import bookingsRouter from "./routes/booking-router.js";
import viewRouter from "./routes/view-router.js";
import { addMoviesAutomatically } from "./controller/movie-controller.js";
import { createAdminIfNotExists } from "./controller/user-controller.js";

dotenv.config();
const app = express();

// 1) Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// 3) EJS
app.set("view engine", "ejs");

// 4) Serve public folder
app.use(express.static("public"));

// 5) API routes
app.use("/user", userRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

// 6) View routes
app.use("/", viewRouter);

// 7) Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected To Database");

    // Seed admin user and some movies
    await createAdminIfNotExists();
    await addMoviesAutomatically();

    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.log(err));
