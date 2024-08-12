class ErrorHandler extends Error{
    constructor(message,statusCode){//this constructor wiil be created when the class is called
        super(message);//this will set the message property of the error class
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor)
    }
}
//this captureStackTrace it captures the error at that point and it will move above
//can be used for debugging
//in that this,this refers to the which class
//this.constructor refects the current object function
//so that the captureStackTrace can fey=tch here and above path.
module.exports=ErrorHandler