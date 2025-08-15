import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // Registration logic here Step by step >>>>>>>

  //                            1. get user details
  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  //                              2. validation checking in two ways
  //  WAY - 1
  //   if (fullName === "") {
  //     throw new ApiError(400, "Full name is required");
  //   }   // if i write like this for all field its too long

  //    WAY  - 2
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //                              3. check if user already exists
  const existingUser = User.findOne({
    $or: [
      { email: email.toLowerCase() }, //  check if email already exists
      { username: username.toLowerCase() }, //  check if username already exists
    ],
  });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //                              4. Check for images store in local path
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  //  Must require a avatar image if not show error
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //               5. Upload avatar and cover image on Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars");
  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    "coverImages"
  );

  //          Check avatar is upload or not
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //             6. Create user and  create entry in db
 const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",    // The cover image is optional
    email,
    password,
    username: username.toLowerCase(),
  });

//                7. Check user is entry in db or not  ||  And remove the password and refreshToken fields
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
//                      8. Check for user creation
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user...");
    }
  //                8. Return response by creating ApiResponse object
     return res.status(201).json(
      new ApiResponse(201, createdUser, "User registered successfully")
     )
});

export { registerUser };
