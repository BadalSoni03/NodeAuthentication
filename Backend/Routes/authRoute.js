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
} = require('../Controller/authController');
const router = express.Router();

router.post('/register' , validateUserRegister , userValidation , registerController);
router.post('/login' , validateUserLogin , userValidation , loginController);
router.post('/logout' , isAuth , logoutController);

module.exports = router;