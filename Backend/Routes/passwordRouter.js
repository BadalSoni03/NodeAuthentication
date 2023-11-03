const express = require('express');
const router = express.Router();
const {
	forgotPasswordController,
	resetPasswordController
} = require('../Controllers/passwordController');

//----------------------------------POST APIs----------------------------------------//


/*
	@desc : sends the forgot password mail to the registered email id of the user
	@API : Public API
	@method : post
	@request : http post request
*/

router.post('/forgot-password' , forgotPasswordController);

//-----------------------------------GET APIs----------------------------------------//


/*
	@desc : resets the password of the user based on the generated passwordToken
	@API : Private API
	@method : get
	@request : http get request
*/

router.get('/reset-password' , resetPasswordController);

module.exports = router;
