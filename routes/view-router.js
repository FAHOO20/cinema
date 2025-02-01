// ./routes/view-router.js
import express from "express";
import fetch from "node-fetch";

const viewRouter = express.Router();

// Middleware for session-based data, unchanged
viewRouter.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.user;
    res.locals.user = req.session.user || null;
    res.locals.message = req.session.message || null;
    req.session.message = null;
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
    // 1) If the user is not logged in, redirect or show message
    if (!req.session.user) {
      req.session.message = "You must log in to book a movie.";
      return res.redirect("/login");
    }
  
    // 2) Get movie from query string, e.g. /new-booking?movie=644f...
    const selectedMovieId = req.query.movie;
    
    // 3) Render with the selected movie ID
    // (If none provided, user can still fill in or we can handle it)
    res.render("new-booking", {
      selectedMovieId,         // pass to EJS
      loggedInUserId: req.session.user._id, // current user
    });
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
        req.session.message = "Invalid email or password. Please try again.";
        return res.redirect("/login");
      }
  
      // ✅ Store `isAdmin` in session
      req.session.user = {
        _id: data.id,
        email: data.email,
        isAdmin: data.isAdmin,
      };
  
      req.session.message = "Login successful!";
      return res.redirect("/");
    } catch (err) {
      console.error("Error during login:", err);
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

  viewRouter.post("/web/booking", async (req, res) => {
    if (!req.session.user) {
      req.session.message = "Please log in first.";
      return res.redirect("/login");
    }
  
    const { movie, date, seatNumber, user } = req.body;
  
    try {
      const response = await fetch("http://localhost:5000/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie, date, seatNumber, user }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error("Booking error:", data.message);
        req.session.message = data.message || "Booking failed.";
        return res.redirect("/movies");
      }
  
      return res.redirect(`/booking-success?bid=${data.booking._id}`);
    } catch (err) {
      console.error("Error during booking:", err);
      req.session.message = "Server error during booking.";
      return res.redirect("/movies");
    }
  });

  viewRouter.get("/booking-success", async (req, res) => {
    const bookingId = req.query.bid;
    if (!bookingId) {
      req.session.message = "No booking ID found. Please check your booking.";
      return res.redirect("/movies");
    }
  
    try {
      const response = await fetch(`http://localhost:5000/booking/${bookingId}`);
      const data = await response.json();
      if (!response.ok) {
        req.session.message = "Could not find booking details.";
        return res.redirect("/movies");
      }
  
      return res.render("booking-confirmation", { booking: data.booking });
    } catch (err) {
      console.error("Booking confirmation error:", err);
      req.session.message = "Error retrieving booking details.";
      return res.redirect("/movies");
    }
  });

  viewRouter.get("/my-bookings", async (req, res) => {
    if (!req.session.user) {
      req.session.message = "Please login first to view your bookings.";
      return res.redirect("/login");
    }
  
    const userId = req.session.user._id;
  
    try {
      const response = await fetch(`http://localhost:5000/user/bookings/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        req.session.message = data.message || "Could not get your bookings.";
        return res.redirect("/movies");
      }
  
      return res.render("my-bookings", { bookings: data.bookings });
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      req.session.message = "Server error retrieving bookings.";
      return res.redirect("/movies");
    }
  });  
  
// Restrict access to new-movie page (only admins)
viewRouter.get("/new-movie", (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
      req.session.message = "Access denied. Admins only.";
      return res.redirect("/movies");
    }
    res.render("new-movie");
  });
  
  // Handle movie submission (only admins)
  viewRouter.post("/new-movie", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
      req.session.message = "Access denied. Admins only.";
      return res.redirect("/movies");
    }
  
    try {
      // Forward the current request's cookie
      const response = await fetch("http://localhost:5000/movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": req.headers.cookie, // <-- pass the same cookie to the next request
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      if (!response.ok) {
        req.session.message = data.message || "Failed to add movie.";
        return res.redirect("/new-movie");
      }
  
      req.session.message = "Movie added successfully!";
      return res.redirect("/movies");
    } catch (err) {
      console.error("Error adding movie:", err);
      req.session.message = "An error occurred.";
      return res.redirect("/new-movie");
    }
  });

export default viewRouter;
