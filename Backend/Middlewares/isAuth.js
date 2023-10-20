const JWT = require('jsonwebtoken');
const User = require('../Models/userModel');

const isAuth = async (req , res , next) => {
	if (req.headers && req.headers.authorization) {
		const token = req.headers.authorization.split(' ')[1];

		try {
			const decode = JWT.verify(token , process.env.JWT_SECRET_KEY);
			const user = await User.findById(decode.userId);
			if (!user) {
				return res.status(400).send({
					success : false,
					message : 'Unauthorized access!'
				});
			}
			req.user = user;
			next();
		} catch (error) {
			if (error === 'JsonWebTokenError') {
				return res.send({
					success : false,
					message : 'Unauthorized access!'
				});
			}
			if (error == 'TokenExpiredError') {
				return res.send({
					success : false,
					message : 'session expired try login!'
				});
			}
			return res.status(500).send({
				success : false,
				message : 'Internal server error'
			});
		}
	} else {
		return res.status(400).send({
			success : false,
			message : 'Unauthorized access!'
		});
	}
}

module.exports = isAuth;