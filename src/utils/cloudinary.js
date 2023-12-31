import fs from "fs"
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET 
});     

const uploadOnCloudinary = async(localPathFile)=>{
    try {

        if(!localPathFile) return null;
       

        const response = await cloudinary.uploader.upload(localPathFile,{
            resource_type : "auto"
        })

      

        fs.unlinkSync(localPathFile)
        console.log("file is uploaded on cloudinary",response.url);
         console.log(response)
        
        return response;

    }catch(error){

        fs.unlinkSync(localPathFile);///remove  the locally saved temp file as the upload operation failed
        return null

    }
};
// not neccessary 
async function run(){

 


    const result= await cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",{ public_id: "olympic_flag" },  function(error, result){
     if (error) {
       console.error(error);
     } else {
      console.log(result.secure_url)
       console.log(result);
     }
   });

   
}

  export { uploadOnCloudinary }