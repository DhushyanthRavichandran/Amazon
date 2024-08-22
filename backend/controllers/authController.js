const CatchAsyncError = require("../middlewares/CatchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../util/jwt");
const ErrorHandler = require("../util/errorHandler");
const sendEmail = require("../util/email");
const crypto=require('crypto');

//Register User - /api/v1/register
exports.registerUser = CatchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatar;
  let BASE_URL=process.env.BACKEND_URL;

  if(process.env.NODE_ENV === "production"){
    BASE_URL=`${req.protocol}://${req.get('host')}`
  }

  if(req.file){
    avatar=`${BASE_URL}/uploads/user/${req.file.originalname}`
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar
  });
  sendToken(user, 200, res);
});

//Login User - /api/v1/login
exports.loginUser = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !email) {
        return next(new ErrorHandler("enter email &passsword", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
        return next(new ErrorHandler("invalid email or password", 401));
    }

    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler("invalid email or password", 401));
    }
  
    sendToken(user, 201, res)
});

//Logout - /api/v1/logout

exports.logoutUser=(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    }).status(200).json({
        success:true,
        message:'logged out'
    })
}

//Forgot Password - /api/v1/password/forgot
exports.forgetPassword = CatchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false });

    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    const resetURL = `${BASE_URL}/password/reset/${resetToken}`;
    const message = `Your password reset URL is as follows:\n\n${resetURL}\n\nIf you have not requested this email, then ignore it.`;

    try {
        sendEmail({
            email: user.email,
            subject: 'Amazon Password Recovery',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message), 500);
    }
});


//Reset Password - /api/v1/password/reset/:token
exports.resetPassword=CatchAsyncError(async (req,res,next)=>{
    const resetPasswordToken=crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordToken:{
            $gt:Date.now()
        }
    });

    if(!user){
        return next(new ErrorHandler('password rest token is invalid or expired',400));       
    }
 
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400));
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpire=undefined;
    await user.save({validateBeforeSave:false});
    sendToken(user,200,res);

})

// Get User Profile - /api/v1/myprofile
exports.getUserProfile = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    // Construct the avatar URL based on the environment
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get('host')}`;
    }
  
    // Check if avatar is already a complete URL
    if (user.avatar && !user.avatar.startsWith('http')) {
        user.avatar = `${BASE_URL}${user.avatar}`;
    }
  
    res.status(200).json({
      success: true,
      user,
    });
});



//Change Password  - api/v1/password/change
exports.changePassword=CatchAsyncError(async (req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');
    
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler('Old password is incorrect',401));

    }
    user.password=req.body.password;
    await user.save();
    sendToken(user,201,res);
})

//Update Profile - /api/v1/update
exports.updateProfile=CatchAsyncError(async (req,res,next)=>{
   
    let newUserData={
        name:req.body.name,
        email:req.body.email
    }

    let avatar;
    let BASE_URL = process.env.BACKEND_URL;

  if(process.env.NODE_ENV === "production"){
    BASE_URL=`${req.protocol}://${req.get('host')}`
  }

    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
        newUserData = {...newUserData,avatar }
    }
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        user
    })
})

//Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = CatchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
         success: true,
         users
    })
 })
 

//Admin: Get Specific User - api/v1/admin/user/:id
exports.getUser=CatchAsyncError(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with this id${req.params.id}`));
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Admin: Update User - api/v1/admin/user/:id
exports.updateUser=CatchAsyncError(async (req,res,next)=>{
    const newData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user=await User.findByIdAndUpdate(req.params.id,newData,{
        new :true,
        runValidators:true,
    })
    res.status(200).json({
        success:true,
        user
    })
})

//Admin: Delete User - api/v1/admin/user/:id
exports.deleteUser = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with this id: ${req.params.id}`, 404));
    }

    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});
