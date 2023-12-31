// require('dotenv').config({path:'./env'})
//import express from "express";
import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({path :'./env'})
// console.log(process.env)
//  const app = express()
 connectDB()

 .then(()=>
 app.listen(process.env.PORT||8000),()=>{

    console.log("server is running on port",process.env.PORT)

    app.on("error",(error)=>{

        console.log( "ERROR:",error);
        throw error
    }    )
})
 
 .catch((error)=>{
    console.log("Mongo db failed connection !",error)
 })

// (async()=>{
//     try{
//       await  mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//       app.on("errror",(error)=>{  // industry standard thing
//         console.log("ERROR : ",error);
//         throw error;
//       })

//       app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`)
//       })
//     }
//     catch(error){

//         console.log("ERROR : " , error);
//         throw error;
//     }
// })()

