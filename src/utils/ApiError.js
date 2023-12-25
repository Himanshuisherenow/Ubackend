class ApiError extends Error {


    constructor(statusCode,message = "something went wrong",errors=[],stack="") {
        
        super(message)
        this.statusCode = statusCode    
        this.data = null //detail about req that triggered the error
        this.message = message
        this.success = false 
        this.errors = errors  
        this.stack = stack  //track of function call an exicution context and file name and line 

        if(stack){
            this.stack = stack 

        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}