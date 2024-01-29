import { Router } from "express";
import { LoginUser, logOutUser, registerUser } from "../controllers/userController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const UserRouter = Router();


UserRouter.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "coverImage",
        maxCount : 1
    }
]), registerUser)


UserRouter.route("login").get( LoginUser )


// secured routes

UserRouter.route("/logout").post( verifyJWT , logOutUser )



export default UserRouter