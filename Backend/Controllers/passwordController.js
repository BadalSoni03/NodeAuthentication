const User = require('../Models/User');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const sendResetPasswordMail = async function (name , email , token) {
	try {
		const transporter = nodemailer.createTransport({
			host : 'smtp.gmail.com',
			port : 587,
			secure : false,
			requireTLS : true,
			auth : {
				user : process.env.gmailID,
				pass : process.env.gmailPassword
			}
		});

		const mailOptions = {
			from : process.env.gmailID,
			to : email,
			subject : 'Reset password mail',
			html : '<p> Jai Shree Ram '+name+', please copy the link <a href = "http://localhost:5000/manage-password/reset-password?token='+token+'"> reset your password</a>'
		};
		transporter.sendMail(mailOptions)
		.then(info => {
			console.log('Mail has been sent with info : ' + info.response);
		})
		.catch(error => {
			console.log('Error while sending the mail : ' + error);
		});

	} catch (error) {
		return res.status(500).send({
			success : false,
			message : error.message
		});
	}
};

const forgotPasswordController = async function (req , res) {
	try {
		const bodyEmail = req.body.email;
		const userFound = await User.findOne({email : bodyEmail});
		if (!userFound) {
			return res.status(200).send({
				success : true,
				message : 'User not found, enter a valid email address'
			});
		}

		const randomString = randomstring.generate();
		await User.updateOne({email : bodyEmail} , {
			$set : {
				passwordToken : randomString
			}
		});

		sendResetPasswordMail(userFound.fullname , bodyEmail , randomString);

		return res.status(200).send({
			success : true,
			message : 'Reset password mail has been sent to your gmail account, please check your inbox or spam folder'
		});

	} catch (error) {
		return res.status(400).send({
			success : false,
			message : 'Error in forgotPasswordController Public API',
			error : error.message
		});
	}
}

const resetPasswordController = async function (req , res) {
	try {
		const newPassword = req.body.password;
		const token = req.query.token;
		const user = await User.findOne({passwordToken : token});
		if (!user) {
			res.status(200).send({
				success : false,
				message : 'The link has been expired'
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword , 10);
		await User.findByIdAndUpdate({_id : user._id} , {
			$set : {
				password : hashedPassword,
				passwordToken : ''
			}
		}, {new : true});

		return res.status(200).send({
			success : true,
			message : 'Password reset successfull'
		});

	} catch (error) {
		return res.status(500).send({
			success : false,
			message : 'Error in resetPasswordController Private API',
			error : error.message
		});
	}
}

module.exports = {
	forgotPasswordController,
	resetPasswordController
};
