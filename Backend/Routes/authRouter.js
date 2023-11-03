const express = require('express');
const isAuth = require('../Middlewares/isAuth');
const {
	validateUserRegister,
	userValidation,
	validateUserLogin
} = require('../Middlewares/Validation/validateUser');
const {
	registerController,
	loginController,
	logoutController
} = require('../Controllers/authController');
const router = express.Router();

//----------------------------------POST APIs----------------------------------------//


/*
	@desc : register the user
	@API : Public API
	@method : post
	@request : http post request
*/

router.post('/register' , validateUserRegister , userValidation , registerController);


/*
	@desc : logs in the user
	@API : Public API
	@method : post
	@request : http post request
*/

router.post('/login' , validateUserLogin , userValidation , loginController);


/*
	@desc : logs out the user
	@API : Public API
	@method : post
	@request : http post request
*/

router.post('/logout' , isAuth , logoutController);

module.exports = router;
