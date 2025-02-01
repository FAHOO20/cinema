import mongoose from "mongoose";
import Movie from "../models/Movie.js";

// Predefined movies
const initialMovies = [
  {
    title: "The Shawshank Redemption",
    description: "Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit. The film portrays the man's unique way of dealing with his new, torturous life; along the way he befriends a number of fellow prisoners, most notably a wise long-term inmate named Red.",
    //"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseDate: "1994-09-22",
    posterUrl: "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg",
    featured: true,
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
  },
  {
    title: "The Godfather",
    description: "The Godfather \"Don\" Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter's wedding. Michael, Vito's youngest son and a decorated WWII Marine is also present at the wedding. Michael seems to be uninterested in being a part of the family business. Vito is a powerful man, and is kind to all those who give him respect but is ruthless against those who do not. But when a powerful and treacherous rival wants to sell drugs and needs the Don's influence for the same, Vito refuses to do it. What follows is a clash between Vito's fading old values and the new ways which may cause Michael to do the thing he was most reluctant in doing and wage a mob war against all the other mafia families which could tear the Corleone family apart.",
    //"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseDate: "1972-03-24",
    posterUrl: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    featured: true,
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
  },
  {
    title: "Inception",
    description: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea, but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.",
   // "A thief who enters the dreams of others to steal their secrets is given a chance to have his criminal history erased.",
    releaseDate: "2010-07-16",
    posterUrl: "https://www.aceshowbiz.com/images/still/inception_poster19.jpg",
    featured: true,
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
  },
  {
    title: "Interstellar",
    description: "In the near future around the American Midwest, Cooper, an ex-science engineer and pilot, is tied to his farming land with his daughter Murph and son Tom. As devastating sandstorms ravage Earth's crops, the people of Earth realize their life here is coming to an end as food begins to run out. Eventually stumbling upon a N.A.S.A. base 6 hours from Cooper's home, he is asked to go on a daring mission with a few other scientists into a wormhole because of Cooper's scientific intellect and ability to pilot aircraft unlike the other crew members. In order to find a new home while Earth decays, Cooper must decide to either stay, or risk never seeing his children again in order to save the human race by finding another habitable planet.",
    //A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: "2014-11-07",
    posterUrl: "https://image.tmdb.org/t/p/original/6ricSDD83BClJsFdGB6x7cM0MFQ.jpg",
    featured: true,
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
  }
];

// Automatically add movies at startup (avoiding duplicates)
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
export const addMovie = async (req, res) => {
  try {
    // Log the incoming body for debugging:
    console.log("💾 addMovie() - body:", req.body);

    let { title, description, releaseDate, posterUrl, featured, actors } = req.body;

    // 1) Convert "featured" (which might be "on" or undefined) to boolean
    featured = featured === "on";

    // 2) If actors is a comma-separated string, split it into an array
    if (typeof actors === "string") {
      actors = actors.split(",").map((actor) => actor.trim());
    }

    // 3) Validate required fields
    if (!title || !description || !posterUrl || !releaseDate || !actors) {
      return res.status(422).json({ message: "Invalid Inputs" });
    }

    // 4) Check if the movie already exists
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists" });
    }

    // 5) Create a new movie
    const movie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate),
      posterUrl,
      featured,
      actors, // now an array
    });

    // 6) Save to DB
    await movie.save();
    console.log("✅ New movie saved:", movie.title);
    return res.status(201).json({ movie });
  } catch (err) {
    console.error("❌ addMovie() error:", err);
    return res.status(500).json({ message: "Request Failed" });
  }
};

// GET - Fetch all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({ movies });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request Failed" });
  }
};

// GET - Fetch a movie by ID
export const getMovieById = async (req, res) => {
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