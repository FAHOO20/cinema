// ./routes/movie-router.js
import express from "express";
import { addMovie, getAllMovies, getMovieById } from "../controller/movie-controller.js";

const movieRouter = express.Router();

movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);

// ✅ Ensure only admins can add movies
movieRouter.post(
  "/",
  (req, res, next) => {
    console.log("🔒 Checking admin in movie-router. Session user =", req.session?.user);

    if (!req.session?.user) {
      return res.status(401).json({ message: "Please log in first." });
    }
    if (!req.session.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // Proceed to addMovie if admin
  },
  addMovie
);

export default movieRouter;
