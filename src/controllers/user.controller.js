import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js ";
import  { User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespons.js";

const registerUser = asyncHandler(async( req, res) => {


    //get user details from frontend
    // validation not empty
    //check if user already exist  : username : email
    //check for images, check for avatar
    //cloudanary upload   , avatar
    //create user obj -  create  entry in db
    //remove password and refresh token field  from response
    // check user creation 
    //return res


    const {fullname , username , email , password } = req.body;
    console.log(email)

    if(
        [fullname , username , email , password ].some((field)=>
        field?.trim() === "")
        
     ){

        throw new ApiError ( 400 , "All field are required")
    }

  const exitstedUser = User.findOne({

        $or: [{ username },{ email }]
    })

    if(exitstedUser){
        throw new ApiError(409,"user with this email or username is exists")
    }


    const avatarLocalPath =    req.files?.avatar[0]?.path;
    const coverImageLocalPath =   req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
   const avatar = await uploadOnCloudinary(avatarLocalPatha);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"Avatar file is required")
   }

  const user = await  User.create({
    fullname ,
    avatar : avatar.url,
    coverImage : coverImage?.url||"",
    email,
    password,
    username : username.toLowerCase()
   })


  const createdUser = await User.
  findById(user._id).
  select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError("500","something went wrong while registering the user")
  }


  return res.status (201).json(
     new ApiResponse(200 ,createdUser,"user registered succses fully")
  )
} )



export {registerUser}