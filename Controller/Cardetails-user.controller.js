const CarDetails = require('../Models/Cardetails-user.model');
const Registartion = require('../Models/Registartion-user.model');
const AppError = require('../utils/appError');
const upload = require('../utils/multer-config');
const _ = require('lodash');
const validateID = require('../utils/validateId')
const mongoose = require('mongoose');

// exports.addCarDetails = async (req, res, next) => {
//     console.log('Request received to add car details');

//     upload(req, res, async (err) => {
//         if (err) {
//             console.error('Upload error:', err);
//             return next(new AppError(err.message, 400));
//         }
//         const { userID } = req.params;
//         const data = req.body;

//         if (!data) return res.status(400).json({ status: 'error', message: 'No data provided.' });
//         if (!userID) return res.status(400).json({ status: 'error', message: 'UserID not found in parameters.' });
//         const { carname, cartype, seatCapacity, vehicleNumber, FuelType } = data;
//         const isAcCar = data.isAcCar === 'true'; // Convert to boolean

//         if (!carname) return res.status(400).json({ status: 'error', message: 'Car Name is required.' });
//         if (!cartype) return res.status(400).json({ status: 'error', message: 'Car Type is required.' });
//         if (!seatCapacity) return res.status(400).json({ status: 'error', message: 'Seat Capacity is required.' });
//         if (typeof isAcCar !== 'boolean') return res.status(400).json({ status: 'error', message: 'AC/Non-AC Car field is required and must be a boolean.' });
//         if (!vehicleNumber) return res.status(400).json({ status: 'error', message: 'Vehicle Number is required.' });
//         if (!FuelType) return res.status(400).json({ status: 'error', message: 'Fuel Type is required.' });

//         // Validate vehicleNumber pattern (e.g., AB1234CD)
//         const vehicleNumberPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
//         if (!vehicleNumberPattern.test(vehicleNumber)) {
//             return res.status(400).json({ status: 'error', message: 'Invalid Vehicle Number format. It should be like AB1234CD.' });
//         }

//         const requiredImages = [
//             'carFront', 'carBack', 'carLeftSide', 'carRightSide',
//             'carInteriorFront', 'carInteriorBack', 'carRCBookFront', 'carRCBookBack'
//         ];

//         for (const image of requiredImages) {
//             if (!req.files || !req.files[image]) {
//                 return res.status(400).json({ status: 'error', message: `${_.startCase(image)} is required.` });
//             }
//         }

//         try {
//             // Check if a car with the same vehicleNumber exists
//             const existingCar = await CarDetails.findOne({ vehicleNumber: vehicleNumber });
//             if (existingCar) {
//                 return res.status(400).json({ status: 'error', message: 'This vehicle number is already registered.' });
//             }

//             // Prepare new CarDetails object
//             const newCarDetails = new CarDetails({
//                 userId: userID,
//                 carId: `CARID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
//                 carname,
//                 cartype,
//                 seatCapacity,
//                 isAcCar,
//                 vehicleNumber,
//                 FuelType
//             });

//             // Add image paths to new CarDetails object if files exist
//             if (req.files) {
//                 requiredImages.forEach(image => {
//                     newCarDetails[image] = req.files[image][0].path;
//                 });
//             }

//             // Save the new CarDetails object
//             const savedCarDetails = await newCarDetails.save();

//             res.status(200).json({
//                 status: 'success',
//                 message: 'Car details added successfully.',
//                 result: savedCarDetails
//             });
//         } catch (err) {
//             return res.status(400).json({ status: 'error', message: err.message });
//         }
//     });
// };



// delete api
exports.deleteCarDetails = async (req, res, next) => {
    const { carId } = req.params;
    console.log(carId);

    if (!carId) {
        return next(new Error('No id is provided!!'));
    }
    const deleteData = await CarDetails.findOneAndDelete({ carId: carId });
    if (!deleteData) {
        return next(new Error('No product found with the provided id.', 404));
    }

    res.json({
        msg: 'delete successful!!',
        status: 'success',
        result: deleteData
    });
}


exports.addCarDetails = async (req, res, next) => {
    console.log('Request received to add car details');

    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err);
            return next(new AppError(err.message, 400));
        }
        const { userID } = req.params;
        const data = req.body;

        if (!data) return res.status(400).json({ status: 'error', message: 'No data provided.' });
        if (!userID) return res.status(400).json({ status: 'error', message: 'UserID not found in parameters.' });
        const { carname, cartype, seatCapacity, vehicleNumber, FuelType } = data;
        const isAcCar = data.isAcCar === 'true'; // Convert to boolean

        if (!carname) return res.status(400).json({ status: 'error', message: 'Car Name is required.' });
        if (!cartype) return res.status(400).json({ status: 'error', message: 'Car Type is required.' });
        if (!seatCapacity) return res.status(400).json({ status: 'error', message: 'Seat Capacity is required.' });
        if (typeof isAcCar !== 'boolean') return res.status(400).json({ status: 'error', message: 'AC/Non-AC Car field is required and must be a boolean.' });
        if (!vehicleNumber) return res.status(400).json({ status: 'error', message: 'Vehicle Number is required.' });
        if (!FuelType) return res.status(400).json({ status: 'error', message: 'Fuel Type is required.' });

        // Validate vehicleNumber pattern (e.g., AB1234CD)
        const vehicleNumberPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
        if (!vehicleNumberPattern.test(vehicleNumber)) {
            return res.status(400).json({ status: 'error', message: 'Invalid Vehicle Number format. It should be like AB1234CD.' });
        }

        const requiredImages = [
            'carFront', 'carBack', 'carLeftSide', 'carRightSide',
            'carInteriorFront', 'carInteriorBack', 'carRCBookFront', 'carRCBookBack'
        ];

        for (const image of requiredImages) {
            if (!req.files || !req.files[image]) {
                return res.status(400).json({ status: 'error', message: `${_.startCase(image)} is required.` });
            }
        }

        try {
            // Check if the userID exists in the Registartion collection
            const userExists = await Registartion.findOne({ userId: userID });
            if (!userExists) {
                return res.status(400).json({ status: 'error', message: 'UserID not found in the database.' });
            }

            // Check if a car with the same vehicleNumber exists
            const existingCar = await CarDetails.findOne({ vehicleNumber: vehicleNumber });
            if (existingCar) {
                return res.status(400).json({ status: 'error', message: 'This vehicle number is already registered.' });
            }

            // Prepare new CarDetails object
            const newCarDetails = new CarDetails({
                userId: userID,
                carId: `CARID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
                carname,
                cartype,
                seatCapacity,
                isAcCar,
                vehicleNumber,
                FuelType
            });

            // Add image paths to new CarDetails object if files exist
            if (req.files) {
                requiredImages.forEach(image => {
                    newCarDetails[image] = req.files[image][0].path;
                });
            }

            // Save the new CarDetails object
            const savedCarDetails = await newCarDetails.save();

            res.status(200).json({
                status: 'success',
                message: 'Car details added successfully.',
                result: savedCarDetails
            });
        } catch (err) {
            return res.status(400).json({ status: 'error', message: err.message });
        }
    });
}

// get car type
exports.getcarType = async (req, res, next) => {
    const carTypes = [
        'Sedan', 'SUV', 'Hatchback', 'Traveller Tempo', 'Bus',
        'Mini Bus', 'Innova Crysta', 'Innova', 'EECO',
        'Premium Car', 'Only Parcel'
    ];

    res.json({
        status: "success",
        message: "Car types retrieved successfully.",
        result: carTypes
    });
};

// get api

exports.getcarrdetails = async (req, res, next) => {

    const cardetails = await CarDetails.countDocuments();

    res.json({
        status: "success",
        message: "Cardetails get successfully.",
        result: cardetails,

    });
};

