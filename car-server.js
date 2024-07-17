
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// routes path

const registartionRoutes = require('./Routes/Registartion-user.route');
const cardetailsRoutes = require('./Routes/Cardetails-user.route');
const carrequirenmentsRoutes = require('./Routes/CarRequirements-user.routes');
const distanceRoutes = require('./Routes/distance-cal.route');
const taxiDetailsRoutes = require('./Routes/TaxiDetail.routes');

const Database_Url = process.env.Database_Url ||'mongodb+srv://nidhivarniinfoteach:udrO62qNlm8MVNdU@cluster0.8dc0a0c.mongodb.net/Bhade-gadi-partner';

const PORT = 4900;

mongoose.connect(Database_Url, { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log("Bhade-gadi-partner database is connected."))
  .catch((err) => console.log(err.message));

const app = express();




app.use(bodyParser.json());
app.use(cookieParser());
// Serve static files from the "uploads" directory
app.use("/public", express.static(__dirname + "/public"))
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());
app.use('/api/v1/uploads', express.static('uploads'));


app.use(cors({
  withCredentials: true,
  origin: ['*', 'http://localhost:3000','http://localhost:3001','http://localhost:3002','http://193.203.162.218:5000','https://199shop.netlify.app']
}));


// app.get('/', authCheck, (req, res) => {
// 	res.json({
// 		status: 'success',
// 		message: `Authorised.`,
// 		data: req.user
// 	});
// });

// deploy routes path
app.use('/api/v1', registartionRoutes);
app.use('/api/v1',cardetailsRoutes);
app.use('/api/v1',cardetailsRoutes)
app.use('/api/v1', distanceRoutes);
app.use('/api/v1', taxiDetailsRoutes);

app.all('*', (req, res) => {
	res.json({
		status: 'fail',
		message: `No route matches with ${req.url}.`,
		data: null
	});
});


app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

