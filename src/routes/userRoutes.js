import { Router } from "express";
import { registerUser } from "../controllers/userController.js";


const UserRouter = Router();


UserRouter.route("/register").post(registerUser)
UserRouter.route("/login").post(registerUser)



export default UserRouter