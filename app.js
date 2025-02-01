  import express from "express";
  import session from "express-session"; // <-- important
  import cors from "cors";
  import mongoose from "mongoose";
  import dotenv from "dotenv";

  import userRouter from "./routes/user-router.js";
  import movieRouter from "./routes/movie-router.js";
  import bookingsRouter from "./routes/booking-router.js";
  import viewRouter from "./routes/view-router.js";

  import { addMoviesAutomatically } from "./controller/movie-controller.js";

  dotenv.config();
  const app = express();

  // 1) Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2) Setup session (BEFORE the viewRouter)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "mysecretkey",
      resave: false,
      saveUninitialized: false,
    })
  );

  // 3) EJS Setup
  app.set("view engine", "ejs");
  app.use(express.static("public"));

  // 4) API Routes
  app.use("/user", userRouter);
  app.use("/movie", movieRouter);
  app.use("/booking", bookingsRouter);

  // 5) View Routes (where we access req.session)
  app.use("/", viewRouter);

  // 6) Connect DB & Start
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      console.log("Connected To Database");
      await addMoviesAutomatically();
      app.listen(5000, () => console.log("Server running on http://localhost:5000"));
    })
    .catch((e) => console.log(e));
