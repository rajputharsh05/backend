import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/APIerrors.js"
import { User } from "../models/userModel.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/APIrespone.js"



const registerUser = asyncHandler(  async ( req, res) => {
    
    // get user details from frontend .
    // validation - not empty .
    // check if user already exists :: username, email .
    // check for images , check for avatar .
    // upload them to cloudinary , avatar .
    // create user object - create entry in db .
    // remove password and refresh-token-field from response .
    // check for user creation
    // return response 
    
    const { fullName , username , email , password } = req.body
    
    console.log(fullName,email,password,username);

    if(
        [fullName , email , username , password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required ");
    }
    

    const ExistedUser = User.findOne({
        $or : [ { email } , { username }]
    });


    if (ExistedUser) {
        throw new ApiError(409 , "User account already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is required .")
    }

    const responseFromCloudinaryForavatar = await uploadOnCloudinary(avatarLocalPath);
    const responseFromCloudinaryForCoverImage = await uploadOnCloudinary(coverImageLocalPath);


    if(!responseFromCloudinaryForavatar){

        throw new ApiError(400 , "Avatar is required .")

    }

    const newUser = await User.create({
        fullName,
        username,
        email,
        password,
        avatar : responseFromCloudinaryForavatar.url,
        coverImage :responseFromCloudinaryForCoverImage?.url || ""
    })

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )


    if(!createdUser) {
        throw new ApiError(500 , "Something Went Wrong")
    }



    return res.status(200).json(
        new ApiResponse(200 , createdUser , "User Registered .")
    )

} ) 

export {
   registerUser 
}