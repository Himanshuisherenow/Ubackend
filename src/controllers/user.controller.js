import {asyncHandler} from "../utils/asyncHandler.js";

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

    


} )


export {registerUser}