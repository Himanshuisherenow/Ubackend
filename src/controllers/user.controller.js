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
   

    if(
        [fullname , username , email , password ].some((field)=>
        field?.trim() === "")
        
     ){

        throw new ApiError ( 400 , "All field are required")
    }

  const exitstedUser = await User.findOne({

        $or: [{ username },{ email }]// whatever matches give result 
    })

    if(exitstedUser){
        throw new ApiError(409,"user with this email or username is exists")
    }


    const avatarLocalPath =  await req.files?.avatar[0]?.path;
    // const coverImageLocalPath = await  req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) &&req.files.coverImage>0){
      coverImageLocalPath = req.files.coverImage[0].path
    }

  //   if(!coverImageLocalPath){
  //     throw new ApiError(400, "coverImage file is required")
  // }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"Avatar file is required")
   }

  const user = await User.create({
    fullname : fullname  ,
    avatar : avatar.url||"",
    coverImage : coverImage?.url||"",
    email : email,
    password :password,
    username : username.toLowerCase()
   })


  const createdUser = await User.
  findById(user._id).
  select("fullname email username")

  if(!createdUser){
    throw new ApiError("500","something went wrong while registering the user",success = false)
  } 


  return res.status (201).json(
     new ApiResponse(200 ,createdUser,"user registered succses fully",)
  )
} )

const loginUser = asyncHandler(async(req,res)=>{
//req.body->data
//username-email
//finduser
//password check
//access and refresh token
//send cookies


const {email,username,password} = req.body;

if(!username || !email){
  throw new ApiError(400,"username or email one is required");
}

const user = await User.findOne({$or: [{username},{email}]})

if(!user){
  throw new ApiError(400,"user not exitst")
}

const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
  throw new ApiError(401, "Invalid user credetials ")

}

const {accessToken,refreshToken} = await generateRefreshAndAccessToken(user._id);

const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

const options  = {
  httpOnly : true,
  secure : true
}

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(new ApiResponse(200,{user : loggedInUser,accessToken,refreshToken},"User logged in successfully"))

})

const generateRefreshAndAccessToken = asyncHandler(async(userId)=>{

  try {

    const user  =  await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    user.save({validateBeforeSave : false })
    return {accessToken,refreshToken }
  } catch (error) {

    throw new ApiError(500,"something went wrong while generating refresh and access token")
    
  }})

const logoutUser = asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(
    req.user._id,{
     $set:{
         refreshToken : undefined,

          }
    },{
      new : true,
    }
  )

  const options = {
    httpOnly : true,
    secure : true
  }

  return  res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged Out "))
  
})
export {registerUser ,logoutUser,loginUser} 