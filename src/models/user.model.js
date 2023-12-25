    import mongoose , {Schema} from "mongoose";
    //import { jsonwebtoken } from "jsonwebtoken"; // bearor token - who have this we will give access 
    import pkg from 'jsonwebtoken';
    import bcrypt from 'bcrypt'
    const { jwt } = pkg;

    const userSchema = new mongoose.Schema({ // new Schema()

        username : {
            type : String,
            required : true,
            unique : true ,
            lowercase : true,
            trim : true,
            index : true

        },
        email : {
            type : String,
            required : true,
            unique : true ,
            lowercase : true,
            trim : true,

        },
        fullname : {
            type : String,
            required : true ,
            trim : true,
            index : true
        },
        avatar : {
            type : String,
            

        },
        coverImage : {
            type : String ,
            
        },
        watchHistory : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Video"
            }
        ],

        password : {
            type : String,
            required : [true , 'password is required']
        },
        refreshToken : {
            type : String
        },


    });


    userSchema.pre("save",async function(next){

        if(!this.isModified("password")) return next();


        this.password = await bcrypt.hash(this.password,10)
        next()
    })

    userSchema.methods.isPassewordCorrect = async function (password){

        return await bcrypt.compare( password, this.password)    
    }

    userSchema.methods.generateAccessToken = function(){

        jwt.sign(
            
        {

            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname,

        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expireIn : process.env.ACCESS_TOKEN_EXPIRY
        })
    }

    userSchema.methods.generateRefreshToken = function(){
        jwt.sign(
            
            {
        
                _id : this._id,
        
            },
        
            process.env.REFRESH_TOKEN_SECRET,
            
            {
                expireIn : process.env.REFRESH_TOKEN_EXPIRY
            })
        
    }

    export const  User = mongoose.model("User", userSchema)