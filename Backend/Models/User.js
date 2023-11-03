const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	fullname : {
		type : String,
		required : true,
		trim : true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	password : {
		type : String,
		required : true
	},
	tokens : [{type : Object}],
	passwordToken : {
		type : String,
		default : ''
	}
},{timestamps : true});

module.exports = mongoose.model('User' , userSchema);
