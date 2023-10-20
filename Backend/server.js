const dotenv = require('dotenv');
const express = require('express');
const connectToDB = require('./Config/database');
const authRoute = require('./Routes/authRoute');
dotenv.config();
connectToDB();

const app = express();
app.use(express.json());
app.use('/auth' , authRoute);

const port = process.env.PORT;
app.listen(port , () => {
	console.log('Node server is running on http://localhost:' + port);
})
