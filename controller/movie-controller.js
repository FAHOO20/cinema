import mongoose from "mongoose";
import Movie from "../models/Movie.js";

// Predefined movies
const initialMovies = [
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseDate: "1994-09-22",
    posterUrl: "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg",
    featured: true,
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseDate: "1972-03-24",
    posterUrl: "https://m.media-amazon.com/images/I/51a1IBP+z2L._AC_SY450_.jpg",
    featured: true,
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
  },
  {
    title: "Inception",
    description: "A thief who enters the dreams of others to steal their secrets is given a chance to have his criminal history erased.",
    releaseDate: "2010-07-16",
    posterUrl: "https://m.media-amazon.com/images/I/51oDPhJbrpL._AC_SY450_.jpg",
    featured: true,
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
  },
  {
    title: "Interstellar",
    description: "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: "2014-11-07",
    posterUrl: "https://m.media-amazon.com/images/I/71UuA9pXfxL._AC_SY450_.jpg",
    featured: true,
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
  }
];

// Function to add movies automatically at startup (avoiding duplicates)
export const addMoviesAutomatically = async () => {
  try {
    for (const movieData of initialMovies) {
      const existingMovie = await Movie.findOne({ title: movieData.title });

      if (!existingMovie) {
        await Movie.create(movieData);
        console.log(`✅ Added movie: ${movieData.title}`);
      } else {
        console.log(`⚠️ Movie "${movieData.title}" already exists. Skipping...`);
      }
    }
  } catch (err) {
    console.error("❌ Error adding movies:", err);
  }
};

// POST - Add a new movie manually
export const addMovie = async (req, res, next) => {
  const { title, description, releaseDate, posterUrl, featured, actors } = req.body;

  if (!title || !description || !posterUrl || !releaseDate || !actors || !Array.isArray(actors)) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    const existingMovie = await Movie.findOne({ title });

    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists" });
    }

    const movie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate),
      posterUrl,
      featured,
      actors,
    });

    await movie.save();
    return res.status(201).json({ movie });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request Failed" });
  }
};

// GET - Fetch all movies
export const getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({ movies });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request Failed" });
  }
};

// GET - Fetch a movie by ID
export const getMovieById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Invalid Movie ID" });
    }
    return res.status(200).json({ movie });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request Failed" });
  }
};
