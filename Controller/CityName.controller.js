const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const CityRoute = require('../Models/CityName.model');
const OneWayRoute = require('../Models/OnewayRoute.model');

// API to add or replace the API key
exports.addcity = catchAsync(async (req, res, next) => {
    const { cityname } = req.body;

    // Check if cityname is provided
    if (!cityname) {
        return next(new AppError('City name is required', 400));
    }

    // Check if the city already exists
    const existingRoute = await CityRoute.findOne({ cityname });

    if (existingRoute) {
        return next(new AppError('City already exists', 400));
    }

    // Create a new route
    const newRoute = await CityRoute.create({ cityname });

    // Send the response
    res.status(201).json({
        status: 'success',
        data: {
            route: newRoute,
        },
    });
});



exports.getroute = catchAsync(async (req, res, next) => {
    const cityname = await CityRoute.find();

    if (!cityname.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'No cityname found'
        });
    }

    return res.status(200).json({
        status: 'success',
        data: {
            cityname
        }
    });
});


// delete city  

exports.deletecity = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Extracting id from request parameters

    // Check if id is provided
    if (!id) {
        return next(new AppError('City ID is required', 400));
    }

    // Find and delete associated routes first
    const deletedRoutes = await OneWayRoute.deleteMany({ cityId: id }); // Assuming your route model has a cityId field

    // Find and delete the city
    const deletedCity = await CityRoute.findByIdAndDelete(id);

    // If no city found, return an error
    if (!deletedCity) {
        return next(new AppError('City not found', 404));
    }

    // Send the response
    res.status(200).json({
        status: 'success',
        message: 'City and associated routes deleted successfully.',
        data: {
            deletedCity,
            deletedRoutes: deletedRoutes.deletedCount, // Optional: include the count of deleted routes
        },
    });
});

