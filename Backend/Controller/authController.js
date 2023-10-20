const JWT = require('jsonwebtoken');
const User = require('../Models/userModel');

const registerController = async (req , res) => {
	const {fullname , email , password} = req.body;
	const isNewUser = await User.newUserOrNot(email);
	if (!isNewUser) {
		return res.status(400).send({
			success : false,
			message : 'User already registered'
		});
	}
	const newUser = await User.create({
		fullname,
		email,
		password,
	});
	
	if (newUser) {
		return res.status(200).send({
			success : true,
			message : 'User registered successfully',
			newUser
		})
	}
	else {
		return res.status(500).send({
			success : false,
			message : 'Error in register API',
		})
	}
};

const loginController = async (req , res) => {
	const {email , password} = req.body;
	const user = await User.findOne({email}); 
	if (!user) { 
		return res.status(400).send({
			success : false,
			message : 'User not registered'
		});
	}

	const isMatch = user.comparePassword(password);
	if (!isMatch) {
		return res.status(400).send({
			success : false,
			message : 'invalid email / password'
		})
	}
	const token = JWT.sign({userId : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : '1d'});
	
	let oldTokens = user.token || [];
	if (oldTokens.length) {
		oldTokens = oldTokens.filter(tkn => {
			const timeDiff = (Date.now() - parseInt(tkn.signedAt)) / 1000;
			if (timeDiff < 86400) {
				return tkn;
			}
		});
	}

	await User.findByIdAndUpdate(user._id , {
		tokens : [...oldTokens , {
			token, 
			signedAt : Date.now().toString()
		}]
	});
	const info = {
		fullname : user.fullname,
		email : user.email
	};
	return res.status(200).send({
		success : true,
		message : 'User logged in successfully',
		user : info,
		token
	});
};

const logoutController = async (req , res) => { 
	try {
		if (req.headers && req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			if (!token) {
				return res.status(400).send({
					success : false,
					message : 'Authorization failed'
				});
			}
			const tokens = req.user.tokens;
			const recentToken = tokens.filter(t => t.token !== token);
			await User.findByIdAndUpdate(req.user._id , {tokens : recentToken});
			return res.status(200).send({
				success : true,
				message : 'logout successfull' 
			});
		}
	} catch (error) {
		console.log('Error while logging out : ' + error.message);
	}
};

module.exports = {
	registerController,
	loginController,
	logoutController
};
