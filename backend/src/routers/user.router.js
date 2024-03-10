import express from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(loginUser);

//protected routes
userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/refresh").post(refreshAccessToken)

userRouter.route("/profile").get( verifyJWT, getCurrentUser);

export default userRouter;
