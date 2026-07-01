import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.post("/users", createUser);
userRouter.delete("/users/:id", deleteUser);
userRouter.patch("/users/:id", updateUser);

export default userRouter;
