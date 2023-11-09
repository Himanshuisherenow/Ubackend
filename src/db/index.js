import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {

        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected!!! DB HOST : ${connectionInstance.connection.host}`)
        //  console.log(connectionInstance)
    }catch(error){

        console.log("MONGODB connection error : ", error);
        process.exit(1); // research in node

    }
}   


export default connectDB