const mongoose = require('mongoose');

const connectToDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL , {
			useNewUrlParser : true,
			useUnifiedTopology : true
		});
		console.log('Connection to mongodb is successfull');
	} catch(err) {
		console.log('Error occurred while connecting with the mongodb : ' + err);
	}
};
module.exports = connectToDB;