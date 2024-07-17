const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const CarRequirements = require('../Models/CarRequirements-user.model')
const cardetails = require('../Models/Cardetails-user.model')
const Registartion = require('../Models/Registartion-user.model')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;

// add Use Profile
exports.addCarRequirenment = catchAsync(async (req, res, next) => {
    const { carId } = req.params;
    console.log('carID =>', carId);

    const data = req.body;

    if (!data) return next(new AppError('No data provided.', 400));
    if (!carId) return res.status(400).json({ status: 'error', message: 'carID not found in parameters.' });

    // Check if carID exists in cardetails collection
    const existingCar = await cardetails.findOne({ carId: carId });
    if (!existingCar) {
        return res.status(404).json({ status: 'error', message: 'Car ID not found.' });
    }

    // Fetch userID associated with the carID
    const registrationInfo = await Registartion.findOne({ userId: existingCar.userId });
    if (!registrationInfo) {
        return res.status(404).json({ status: 'error', message: 'User ID associated with car ID not found.' });
    }

    const { gotCanceled, isCarAssign, fromCity, formState, toCity, toState, date, time, carType, budget, tripType, forVerifiedPeople, note } = data;

    if (typeof gotCanceled !== 'boolean') return res.status(400).json({ status: 'error', message: 'gotCanceled is required.' });
    if (typeof isCarAssign !== 'boolean') return res.status(400).json({ status: 'error', message: 'isCarAssign is required.' });
    if (!fromCity) return res.status(400).json({ status: 'error', message: 'fromCity is required.' });
    if (!formState) return res.status(400).json({ status: 'error', message: 'formState is required.' });
    if (!toCity) return res.status(400).json({ status: 'error', message: 'toCity is required.' });
    if (!toState) return res.status(400).json({ status: 'error', message: 'toState is required.' });
    if (!date) return res.status(400).json({ status: 'error', message: 'date is required.' });
    if (!time) return res.status(400).json({ status: 'error', message: 'time is required.' });
    if (!carType) return res.status(400).json({ status: 'error', message: 'carType is required.' });
    if (!budget) return res.status(400).json({ status: 'error', message: 'budget is required.' });
    if (!tripType) return res.status(400).json({ status: 'error', message: 'tripType is required.' });
    if (typeof forVerifiedPeople !== 'boolean') return res.status(400).json({ status: 'error', message: 'forVerifiedPeople is required.' });
    if (!note) return res.status(400).json({ status: 'error', message: 'note is required.' });

    data.userId = registrationInfo.userId; // Assign userID from registrationInfo
    data.carId = carId;
    data.postId = `POSTID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

    const newRegistration = await CarRequirements.create(data);


    res.json({
        status: 'success',
        message: 'Car Requirements Data added successfully.',
        result: newRegistration
    });
});



exports.serchfromcity = async (req, res, next) => {
    try {
        const { fromCity, toCity, } = req.query;

        let query = {};
        console.log(query);

        if (fromCity) {
            query.fromCity = { $regex: new RegExp(fromCity) };
        }

        if (toCity) {
            query.toCity = { $regex: new RegExp(toCity) };
        }

        const products = await CarRequirements.find(query);
        if (products.length > 0) {
            return res.status(200).json(products);
        } else {
            return res.status(404).json({ message: "Data not Found ." });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

// get api
exports.getcarrequirenment = async (req, res, next) => {

    const getcarrequirenment = await CarRequirements.countDocuments();

    res.json({
        status: "success",
        message: "CarRequirements get successfully.",
        result: getcarrequirenment,

    });
};

