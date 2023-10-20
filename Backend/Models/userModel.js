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
		unique : true,
		trim : true
	},
	password : {
		type : String,
		required : true,
		trim : true
	},
	tokens : [{type : Object}]
},{timestamps : true});

userSchema.pre('save' , async function (next) { 
	try {
		if (!this.isModified('password')) {
			next();
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password , salt);
		this.password = hashedPassword;
	}
	catch (error) {
		console.log('Error in pre('save') operation : ' + error.message);
	}
});

userSchema.methods.comparePassword = async (enteresPassword) => {
	try { 
		return await bcrypt.compare(enteresPassword , this.password);
	} catch (error) {
		console.log('Error while comparing passwords : ' + error.message);
	}
};

userSchema.statics.newUserOrNot = async function (email) {
	if (!email) throw new Error('Invalid email');
	try {
		const user = await this.findOne({email});
		if (user) return false;
		return true;
	} catch (error) {
		console.log('Something went wrong inside the newUserOrNot method ' + error.message);
		return false;
	}
}

module.exports = mongoose.model('User' , userSchema);
