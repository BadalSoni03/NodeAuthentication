const {check , validationResult} = require('express-validator');

const validateUserRegister = [
	check('fullname')
	.trim()
	.not()
	.isEmpty()
	.withMessage('Name is required')
	.isString()
	.withMessage("Name must be a valid name")
	.isLength({min : 3 , max : 20})
	.withMessage('Name must be between 3 to 20 characters'),
	
	check('email')
	.trim()
	.normalizeEmail({gmail_remove_dots: false})
	.isEmail()
	.withMessage('Enter a valid email id'),
	
	check('password')
	.trim()
	.not()
	.isEmpty()
	.withMessage('Password is empty')
	.isLength({min : 8 , max : 20})
	.withMessage('Password must be between 8 to 20 characters'),

	check('confirmPassword')
	.trim()
	.not()
	.isEmpty()
	.custom((value , {req}) => {
		if (value !== req.body.password) {
			throw new Error('Both password and confirm-password must be same')
		}
		return true;
	})
];

const userValidation = function (req , res , next) {
	const result = validationResult(req).array();
	if (!result.length) return next();

	const error = result[0].msg;
	console.log('In userValidation method : ' + error);
	return res.status(400).send({
		success : false,
		message : error
	});
}

const validateUserLogin = [
	check('email')
	.trim()
	.isEmail()
	.withMessage('email is required'),

	check('password')
	.trim()
	.not()
	.isEmpty()
	.withMessage('password is required')
];

module.exports = {
	validateUserRegister,
	userValidation,
	validateUserLogin
};
