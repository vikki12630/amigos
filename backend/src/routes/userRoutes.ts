import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware";

import { register, login, refreshAccessToken, logout, getCurrentUser } from "../controllers/userController";


const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);

// secure routes
router.route("/logout").get(verifyJWT,logout);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);


export default router;