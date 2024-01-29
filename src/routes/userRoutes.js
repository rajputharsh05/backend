import { Router } from "express";
import { LoginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/userController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const UserRouter = Router();


UserRouter.route("/register").post(upload.fields([ { name : "avatar", maxCount : 1 }, { name : "coverImage", maxCount : 1 } ]), registerUser)
UserRouter.route("/login").post( LoginUser )

// secured routes

UserRouter.route("/logout").post( verifyJWT , logOutUser )
UserRouter.route("/refresh-token").post( refreshAccessToken )



export default UserRouter