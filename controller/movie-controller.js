import mongoose from "mongoose";
// ❌ Removed: import jwt from "jsonwebtoken";
// ❌ Removed: import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";

export const addMovie = async (req, res, next) => {
  // Because we removed admin logic, no need to verify token here
  // If you still need user-based authentication checks, re-add them as needed

  const { title, description, releaseDate, posterUrl, featured, actors } = req.body;
  
  // Simple input validation
  if (
    !title ||
    !description ||
    !posterUrl ||
    title.trim() === "" ||
    description.trim() === "" ||
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate),
      posterUrl,
      featured,
      actors,
      // ❌ Removed: admin field
    });
    await movie.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;
  try {
    movies = await Movie.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request Failed" });
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};
