const ErrorHandler = require("../util/errorHandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;

    if(process.env.NODE_ENV=='development'){
    res.status( err.statusCode).json({
        success:false,
        message:err.message,//super(message);/ we have used this line so that the error message
        //is already set and here it is fetched
        stack:err.stack,
        error:err
    })
}
else if (process.env.NODE_ENV === 'production') {
    let message = err.message;
    

    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(value => value.message).join(', ');
        err = new ErrorHandler(message, 400);
    }
    else if (err.name === 'CastError') {
        message = `Resource not found: ${err.value}`;
        err = new ErrorHandler(message, 400);
    }
    else if (err.code === 11000) {
        message = `Duplicate field value entered`;
        error = new ErrorHandler(message, 400);
    }

    else if(err.name=='JSONWebTokenError'){
        let message = `JSON Web Token is invalid. Try again`;
        error=new ErrorHandler(message, 400);
    }

    if(err.name == 'TokenExpiredError') {
        let message = `JSON Web Token is expired. Try again`;
        error=new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message || 'Internal server Error'
    });
}

}