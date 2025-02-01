// ./routes/view-router.js
import express from "express";
import fetch from "node-fetch";

const viewRouter = express.Router();

// Middleware to pass login info & messages to all templates
viewRouter.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.user;
    res.locals.user = req.session.user || null;
    res.locals.message = req.session.message || null;
    req.session.message = null; // Clear message after displaying
    next();
  });
  

// 🏠 Home Page
viewRouter.get("/", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5000/movie");
    const data = await response.json(); // { movies: [...] }
    res.render("index", { movies: data.movies });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching movies");
  }
});

// 🎬 All Movies
viewRouter.get("/movies", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5000/movie");
    const data = await response.json();
    res.render("movies", { movies: data.movies });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching movies");
  }
});

// 🎬 Movie Details
viewRouter.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`http://localhost:5000/movie/${id}`);
    if (!response.ok) return res.status(404).send("Movie not found");
    const data = await response.json(); // { movie: {...} }
    res.render("movie-details", { movie: data.movie });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching movie");
  }
});

// 📝 Sign Up Page (GET)
viewRouter.get("/signup", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("signup");
});

// 🔐 Login Page (GET)
viewRouter.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("login");
});

// 📅 Book a ticket (GET)
viewRouter.get("/new-booking", (req, res) => {
  // If you only allow logged-in users to book, uncomment:
  // if (!req.session.user) return res.redirect("/login");
  res.render("new-booking");
});

// (Optional) Show a single booking (GET)
viewRouter.get("/booking/:id", async (req, res) => {
  const bookingId = req.params.id;
  try {
    const response = await fetch(`http://localhost:5000/booking/${bookingId}`);
    if (!response.ok) {
      return res.status(404).send("Booking not found");
    }
    const data = await response.json(); // { booking: {...} }
    res.render("booking-details", { booking: data.booking });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching booking");
  }
});

/* 
  NEW ROUTES: "Bridge" endpoints
  These call your existing JSON routes (/user/signup, /user/login) 
  but redirect or re-render EJS on success/fail.
*/

// 📝 Sign Up (POST) - bridging to /user/signup
viewRouter.post("/web/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.log("Signup error:", data.message);
        req.session.message = "Signup failed. Please try again.";
        return res.redirect("/signup");
      }
  
      req.session.message = "Signup successful! Please log in.";
      return res.redirect("/login");
    } catch (err) {
      console.error("Error bridging signup:", err);
      req.session.message = "An error occurred. Please try again.";
      return res.redirect("/signup");
    }
  });
  
  // 🔐 Login (POST) - Bridging to /user/login
  viewRouter.post("/web/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.log("Login error:", data.message);
        req.session.message = "Invalid email or password. Please try again.";
        return res.redirect("/login");
      }
  
      req.session.user = { _id: data.id, email };
      req.session.message = "Login successful!";
      return res.redirect("/");
    } catch (err) {
      console.error("Error bridging login:", err);
      req.session.message = "An error occurred. Please try again.";
      return res.redirect("/login");
    }
  });
  
  // 🔒 Logout (GET)
  viewRouter.get("/logout", (req, res) => {
    req.session.user = null;
    req.session.message = "You have been logged out.";
    res.redirect("/");
  });
  

export default viewRouter;
