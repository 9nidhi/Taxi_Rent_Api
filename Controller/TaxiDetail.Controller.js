const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const TaxiDetails = require('../Models/TaxiDetail.models');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique file name
    },
});

const upload = multer({ storage: storage });

// Middleware to handle multiple file uploads
exports.uploadImages = upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'car_img', maxCount: 1 }
]);

exports.addtaxiDetails = catchAsync(async (req, res, next) => {
    try {
        const data = req.body;
        const { car_name, rate, bootspace, seats, isAcCar, car_type } = data;

        // Validate required fields
        const missingFields = [];
        if (!car_name) missingFields.push('car_name');
        if (!rate) missingFields.push('rate');
        if (!bootspace) missingFields.push('bootspace');
        if (!seats) missingFields.push('seats');
        if (!car_type) missingFields.push('car_type');
        if (isAcCar === undefined) missingFields.push('isAcCar');

        if (missingFields.length > 0) {
            return res.json({
                status: 'fail',
                message: 'Required fields are missing.',
                missingFields: missingFields
            });
        }

        // Check if the combination of car_name already exists
        const existingRecord = await TaxiDetails.findOne({ car_name });
        if (existingRecord) {
            return res.json({
                status: 'fail',
                message: 'Car with this name already exists.',
            });
        }

        // Validate the presence of uploaded files
        if (!req.files.icon || !req.files.car_img) {
            const missingFiles = [];
            if (!req.files.icon) missingFiles.push('icon');
            if (!req.files.car_img) missingFiles.push('car_img');
            return res.json({
                status: 'fail',
                message: 'Required files are missing.',
                missingFiles: missingFiles
            });
        }

        // Extract the file paths from the request
        const icon = req.files.icon[0].filename;
        const car_img = req.files.car_img[0].filename;

        // Convert seats to a number
        const seatsNumber = parseInt(seats, 10);
        if (isNaN(seatsNumber)) {
            return res.json({
                status: 'fail',
                message: 'Seats must be a number.',
            });
        }

        // Create a new CarDetails document with the data and image paths
        const carDetails = await TaxiDetails.create({ ...data, icon, car_img, seats: seatsNumber });

        res.json({
            status: 'success',
            message: 'Car details added successfully.',
            result: carDetails,
        });
    } catch (err) {
        let message;
        if (err.name === "MongoServerError" && err.code === 11000) {
            message = "Car with this name already exists.";
        }

        res.json({
            status: 'fail',
            message: message || err.message || 'Unknown error occurred.',
            data: null,
        });
    }
});



//get
exports.getTaxidetails = catchAsync(async (req, res, next) => {


    const product = await TaxiDetails.find()

    res.json({
        status: 'success',
        message: 'Taxi Details get successfully.',
        result: product,

    });
});


//search wise seats
exports.getsearchsets = catchAsync(async (req, res, next) => {
    const { seats } = req.query;

    // Validate the seats parameter
    if (!seats) {
        return res.status(400).json({
            status: 'fail',
            message: 'Seats parameter is required.',
        });
    }

    // Convert seats to a number and validate it
    const seatsNumber = parseInt(seats, 10);
    if (isNaN(seatsNumber) || seatsNumber < 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid seats parameter.',
        });
    }

    // Find taxi details with the number of seats greater than or equal to the given value
    const product = await TaxiDetails.find({ seats: { $gte: seatsNumber } });

    res.json({
        status: 'success',
        message: 'Taxi details retrieved successfully.',
        result: product,
    });
});


//delete api
exports.deletetaxidetail = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // console.log(id);

    if (!id) {

        res.json({
            msg: 'No id is provided.',
            status: 'fail',

        });
    }

    const deleteData = await TaxiDetails.findOneAndDelete({ id: id });
    if (!deleteData) {
        res.json({
            msg: 'No product found with the provided id.',
            status: 'fail',

        });
    }

    res.json({
        msg: 'delete successful!!',
        status: 'success',
        result: deleteData
    });
})

//update
exports.updatetaxidetail = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const update = req.body;
console.log(' update=>',update);

    // Handle file uploads if present
    if (req.files) {
        if (req.files.icon) {
            update.icon = req.files.icon[0].filename;
        }
        if (req.files.car_img) {
            update.car_img = req.files.car_img[0].filename;
        }
    }

    try {
        const updatedTaxiDetail = await TaxiDetails.findByIdAndUpdate(id, update, { new: true });

        if (!updatedTaxiDetail) {
            return res.status(404).json({ message: 'Taxi detail not found' });
        }

        // res.status(200).json(updatedTaxiDetail);
        res.json({
            status: 'success',
            message: 'Car details added successfully.',
            result: updatedTaxiDetail,
        });
    } catch (err) {
        console.error('Error updating taxi details:', err);
        res.status(500).json({ message: 'Server error' });
    }

});