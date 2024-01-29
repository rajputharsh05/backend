import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIerrors.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIrespone.js";

const genetateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccesToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.refreshToken = RefreshToken;

    await user.save({ validateBeforeSave: false });

    return {
      AccesToken,
      RefreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend .
  // validation - not empty .
  // check if user already exists :: username, email .
  // check for images , check for avatar .
  // upload them to cloudinary , avatar .
  // create user object - create entry in db .
  // remove password and refresh-token-field from response .
  // check for user creation
  // return response

  const { fullname, username, email, password } = req.body;

  console.log(fullname, email, password, username);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required ");
  }

  const ExistedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (ExistedUser) {
    throw new ApiError(409, "User account already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  } else {
    coverImageLocalPath = "";
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required .");
  }

  const responseFromCloudinaryForavatar =
    await uploadOnCloudinary(avatarLocalPath);
  const responseFromCloudinaryForCoverImage =
    await uploadOnCloudinary(coverImageLocalPath);

  if (!responseFromCloudinaryForavatar) {
    throw new ApiError(400, "Avatar is required .");
  }

  const newUser = await User.create({
    fullname,
    username,
    email,
    password,
    avatar: responseFromCloudinaryForavatar.url,
    coverImage: responseFromCloudinaryForCoverImage?.url || "",
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Registered ."));
});

const LoginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie
  // send the response

  const { email, username, password } = req.body;

  if (!username || !username) {
    throw new ApiError(400, "username or password is required");
  }

  const UserDetailsFromDataBase = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!UserDetailsFromDataBase) {
    throw new ApiError(404, "User is not registered");
  }

  const isPasswordValid =
    await UserDetailsFromDataBase.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Informations");
  }

  const { AccesToken, RefreshToken } = await genetateAccessAndRefreshTokens(
    UserDetailsFromDataBase._id
  );

  const loggedInUser = await User.findById(UserDetailsFromDataBase._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", AccesToken, options)
    .cookie("refreshToken", RefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          AccesToken,
          RefreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, LoginUser, logOutUser };





/// https://res.cloudinary.com/ddgekxnr4/image/upload/v1706554499/p9bihauofuigll6b6act.jpg
/// http://res.cloudinary.com/ddgekxnr4/image/upload/v1706554499/p9bihauofuigll6b6act.jpg
