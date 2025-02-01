import express from "express";
import {
  deleteUser,
  getAllUsers,
  getBookingsOfUser,
  getUserById,
  login,        // We'll update logic inside user-controller.js
  singup,       // We'll update logic inside user-controller.js
  updateUser,
} from "../controller/user-controller.js";

const userRouter = express.Router();

// Example routes
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", singup);   // signup -> redirect on success
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);     // login -> redirect on success
userRouter.get("/bookings/:id", getBookingsOfUser);

export default userRouter;
