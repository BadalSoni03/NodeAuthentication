const dotenv = require('dotenv');
const express = require('express');
const connectToDB = require('./Config/database');
const authRouter = require('./Routes/authRouter');
const passwordRouter = require('./Routes/passwordRouter');
dotenv.config();
connectToDB();

const app = express();
app.use(express.json());

// routes
app.use('/auth' , authRouter);
app.use('/manage-password' , passwordRouter);

const port = process.env.PORT;
app.listen(port , () => {
	console.log('Node server is running on http://localhost:' + port);
})
