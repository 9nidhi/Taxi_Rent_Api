const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const OneWayRoute = require('../Models/OnewayRoute.model');
const mongoose = require('mongoose');
const CityName = require('../Models/CityName.model');



// API to add a route under a specific city by city ID from query parameters
// Handler to add a route to a city

// Handler to add a route to a city
exports.addRoute = catchAsync(async (req, res, next) => {
    const { routeName } = req.body;
    const { cityId } = req.query;

    if (!cityId) {
        return next(new AppError('City ID is required', 400));
    }
    if (!routeName) {
        return next(new AppError('Route name is required', 400));
    }

    const existingCity = await CityName.findById(cityId);
    if (!existingCity) {
        return next(new AppError('City not found', 404));
    }

    const updatedRoute = await OneWayRoute.findOneAndUpdate(
        { cityId },
        {
            $addToSet: { routeNames: routeName }, // Add new route if not already in array
            $setOnInsert: { cityName: existingCity.cityname }, // Set city name if creating new document
        },
        { new: true, upsert: true } // Upsert option to create new doc if cityId not found
    );

    res.status(201).json({
        status: 'success',
        data: {
            routeNames: updatedRoute.routeNames,
            routeCityName: existingCity.cityname,
        },
    });
});





// delete city  
exports.deletecity = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Extracting id from request parameters

    // Check if id is provided
    if (!id) {
        return next(new AppError('City ID is required', 400));
    }

    // Find and delete the city
    const deletedCity = await OneWayRoute.findByIdAndDelete(id);

    // If no city found, return an error
    if (!deletedCity) {
        return next(new AppError('City not found', 404));
    }

    // Send the response
    res.status(200).json({  // Changed to 200 OK to include a message
        status: 'success',
        message: 'City deleted successfully.',
        data: deletedCity, // Optional: you can include deletedCity if you want to return the deleted document
    });
});


// API to edit a route by route ID
exports.editroute = catchAsync(async (req, res, next) => {
    const { id, routeIndex } = req.params; // Route document ID and routeIndex
    const { routeName, routeCityName } = req.body; // New routeName and optional routeCityName

    // Check if required fields are provided
    if (!id) {
        return next(new AppError('Route ID is required', 400));
    }
    if (!routeName) {
        return next(new AppError('Route name is required', 400));
    }
    if (routeIndex === undefined || routeIndex < 0) {
        return next(new AppError('Route index is required', 400));
    }

    // Convert routeIndex to a number since it's received as a string
    const index = Number(routeIndex);

    // Find the route by ID
    const route = await OneWayRoute.findById(id);
    if (!route) {
        return next(new AppError('Route not found', 404));
    }
console.log('route =>',route);

    // Log route names and their length for debugging
    console.log('Route Names:', route.routeNames);
    console.log('Route Names Length:', route.routeNames.length);

    // Check if the index is valid
    if (route.routeNames[index] === undefined) {
        return next(new AppError('Invalid route index', 400));
    }

    // Update the specific route name
    route.routeNames[index] = routeName;

    // If city name is also being updated
    if (routeCityName) {
        route.cityName = routeCityName; // Updated to reflect correct field name
    }

    // Save the updated route
    await route.save();

    // Send the response with the updated route data
    res.status(200).json({
        status: 'success',
        data: {
            routeNames: route.routeNames,
            cityName: route.cityName, // Updated to reflect correct field name
        },
    });
});



exports.getroutebycity = catchAsync(async (req, res, next) => {
    const cityname = await OneWayRoute.find();

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

exports.routdelete = catchAsync(async (req, res, next) => {
    try {
        const { id, routeIndex } = req.params; // Get city ID and route index from URL parameters
        const city = await OneWayRoute.findById(id); // Find the city by ID
    
        console.log('id, routeIndex =>', id, routeIndex);
        console.log('city =>', city); // Log the city object
    
        if (!city) {
            return res.status(404).json({ status: 'error', message: 'City not found' });
        }
    
        // Convert routeIndex to an integer
        const index = parseInt(routeIndex, 10);
    
        // Check if routeNames exists and is an array
        if (!city.routeNames || !Array.isArray(city.routeNames)) {
            return res.status(400).json({ status: 'error', message: 'Routes not found or invalid format' });
        }
    
        // Check if the index is valid
        if (index < 0 || index >= city.routeNames.length) {
            return res.status(400).json({ status: 'error', message: 'Invalid route index' });
        }
    
        city.routeNames.splice(index, 1); // Remove the route at the specified index
        await city.save(); // Save the updated city document
    
        res.status(200).json({ status: 'success', message: 'Route deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
    
});
