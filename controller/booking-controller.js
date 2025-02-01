import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;

  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database lookup failed" });
  }

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found with given ID" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given ID" });
  }

  let booking;
  try {
    booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
    });

    // Save booking
    await booking.save();

    // Add booking reference to User and Movie
    existingUser.bookings.push(booking._id);
    existingMovie.bookings.push(booking._id);

    // Save updated User and Movie
    await existingUser.save();
    await existingMovie.save();

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
};


export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

// Remove session/transaction to avoid the replica-set error
export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  try {
    // 1) Fetch the booking + its user/movie references
    const booking = await Bookings.findById(id)
      .populate("user")
      .populate("movie");

    // 2) If no booking found, respond with an error
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 3) Safely pull references from user & movie, if they exist
    if (booking.user) {
      booking.user.bookings.pull(booking._id);
      await booking.user.save();
    }

    if (booking.movie) {
      booking.movie.bookings.pull(booking._id);
      await booking.movie.save();
    }

    // 4) Remove the booking document itself
    await Bookings.findByIdAndRemove(id);

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to Delete" });
  }
};
