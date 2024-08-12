const express = require('express');
const multer=require('multer');
const path=require('path');
 
upload=multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,path.join(__dirname,'..','uploads/user'));
        },
        filename:function(req,file,cb){
            cb(null,file.originalname);
        }
    })
})

const {isAuthenticatedUser,authorizeRoles}=require('../middlewares/authenticate')
const { registerUser,
        resetPassword, 
        forgetPassword,
        loginUser,
        logoutUser,
        changePassword,
        getUserProfile,
        updateProfile,
        getAllUsers,
        getUser,
        updateUser,
        deleteUser,
        
    }=require('../controllers/authController')
const router = express.Router();
router.route('/register').post(upload.single('avatar'),registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser);
router.route('/password/forget').post(forgetPassword)
router.route('/password/reset/:token').post(resetPassword)


router.route('/password/change').put(isAuthenticatedUser,changePassword)
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/update').put(isAuthenticatedUser,upload.single('avatar'), updateProfile);



//Admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getUser)
                                .put(isAuthenticatedUser,authorizeRoles('admin'), updateUser)
                                .delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);

module.exports = router;
