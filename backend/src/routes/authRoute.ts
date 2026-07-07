import express from "express";
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
} from "#/controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", loginUser);
authRouter.post("/auth/logout", logoutUser);
authRouter.post("/auth/refresh", refreshUserToken);

export default authRouter;
