import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import  {ApiError} from "../utils/ApiError.js"



// so everytime we dont need write user is valid or not we can make a middleware

// if user is login  then it will take autometaiclly access or refresh tocken from the cookies 

// and if it is not then unauthorise user

//NOTE: when you go to other route 


export const verifyJWT = asyncHandler(async(req,_,next)=>{


    try {
        const token = req.cookies?.accessToken ||req.header("Authorization")?.replace("Bearer","");
    
        if(!token){
            throw new ApiError(400,"Unauthorized request")
        
        };
    
       const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
    
       const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")
    
       if(!user){
        // something about forntend
        throw new ApiError(401,"Invalid Access Token")
       }
    
       

       req.user = user;

       next()
    } catch (error) {
        
        throw new ApiError(401,error?.message||"invalid access Token ")
    }
})