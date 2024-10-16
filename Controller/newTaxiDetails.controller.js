const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const NewTaxiDetails = require('../Models/newTaxiDetails.model');
const Car = require('../Models/newTaxiDetails.model');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

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
    { name: 'Image', maxCount: 1 }
]);

exports.addNewTaxiDetails = catchAsync(async (req, res, next) => {
    const {
        Name, BootSpace, seats, Type, IsAcCar, onewayTrip,
        roundTrip, eightHours, tenHours, twelveHours, airportTrip
    } = req.body;

    const { icon, Image } = req.files;

    // Check if all required fields are provided
    if (!Name || !BootSpace || !seats || !Type || !IsAcCar || !onewayTrip || !roundTrip || !eightHours || !tenHours || !twelveHours || !airportTrip || !icon || !Image) {
        return next(new AppError('All fields are required', 400));
    }

    // Check if the car name is unique
    const existingTaxi = await NewTaxiDetails.findOne({ Name });
    if (existingTaxi) {
        return next(new AppError('Car name already exists', 400));
    }

    // Create new taxi details
    const newTaxiDetails = await NewTaxiDetails.create({
        Name,
        icon: icon[0].path,
        Image: Image[0].path,
        BootSpace,
        seats,
        Type,
        IsAcCar,
        onewayTrip: JSON.parse(onewayTrip),
        roundTrip: JSON.parse(roundTrip),
        eightHours: JSON.parse(eightHours),
        tenHours: JSON.parse(tenHours),
        twelveHours: JSON.parse(twelveHours),
        airportTrip: JSON.parse(airportTrip)
    });

    res.status(201).json({
        status: 'success',
        data: {
            newTaxiDetails
        }
    });
});




exports.gettaxi = catchAsync(async (req, res, next) => {
    // Fetch and sort the data based on the number of seats
    const taxis = await NewTaxiDetails.find().sort({ seats: 1 }); // 1 for ascending, -1 for descending

    if (!taxis) {
        return next(new AppError('No taxis found', 404));
    }

    res.status(200).json({
        status: 'success',
        results: taxis.length,
        data: {
            taxis
        }
    });
});

// exports.searchalldata = catchAsync(async (req, res, next) => {
//     const { type } = req.query;
//     console.log('type =>', type);

//     if (!type) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Query parameter "type" is required'
//       });
//     }

//     const query = {};
//     query[type + '.isAvailable'] = "Yes"; // Search for documents where the specified type has isAvailable set to 'Yes'

//     console.log('query =>', query);

//     const taxiDetails = await NewTaxiDetails.find(query).select({
//       id: 1,
//       Name: 1,
//       icon: 1,
//       Image: 1,
//       rate: 1,
//       BootSpace: 1,
//       seats: 1,
//       Type: 1,
//       IsAcCar: 1,
//       [type]: 1 // Select the specified type object
//     });

//     if (!taxiDetails.length) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'No taxi details found for the specified type'
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         taxiDetails
//       }
//     });
//   });
// http://localhost:4900/api/v1/searchalldata?type=tenHours

// exports.searchalldata = catchAsync(async (req, res, next) => {
//     const { type, seats, sort } = req.query;

//     // Check for valid query parameters
//     if (!type && !seats) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Query parameters "type" or "seats" are required'
//         });
//     }

//     // Construct the query object
//     const query = {};

//     // Define special trip types
//     const specialTypes = ['onewayTrip', 'tenHours', 'eightHours', 'twelveHours'];

//     if (type) {
//         if (specialTypes.includes(type)) {
//             // Special handling for the specified trip types
//             query[type + '.isAvailable'] = "Yes";
//         } else {
//             // General filtering for other types
//             query[type + '.isAvailable'] = "Yes";
//         }
//     }

//     if (seats) {
//         const minSeats = parseInt(seats, 10);
//         if (isNaN(minSeats)) {
//             return res.status(400).json({
//                 status: 'fail',
//                 message: 'Query parameter "seats" must be a valid number'
//             });
//         }

//         if (specialTypes.includes(type) && minSeats >= 7) {
//             // For special trip types, show only taxis with exactly 7 seats if minSeats is 7 or greater
//             query.seats = 7;
//         } else if (minSeats <= 20) {
//             // General seat filter logic
//             query.seats = { $gte: minSeats };
//         } else {
//             query.seats = 20; // If the specified value is greater than 20, find cars with exactly 20 seats
//         }
//     }

//     // Determine the sort order
//     const sortOrder = sort === 'asc' ? 1 : -1; // Ascending order for 'asc', descending otherwise

//     // Find the taxi details based on the query object and apply sorting
//     const taxiDetails = await NewTaxiDetails.find(query)
//         .sort({ seats: sortOrder }) // Replace `seats` with the desired field to sort by
//         .select({
//             id: 1,
//             Name: 1,
//             icon: 1,
//             Image: 1,
//             rate: 1,
//             BootSpace: 1,
//             seats: 1,
//             Type: 1,
//             IsAcCar: 1,
//             [type]: 1 // Select the specified type object if provided
//         });

//     if (!taxiDetails.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No taxi details found for the specified criteria'
//         });
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             taxiDetails
//         }
//     });
// });


exports.searchalldata = catchAsync(async (req, res, next) => {
    const { type, seats, sort } = req.query;

    // Check for valid query parameters
    if (!type && !seats) {
        return res.status(400).json({
            status: 'fail',
            message: 'Query parameters "type" or "seats" are required'
        });
    }

    // Construct the query object
    const query = {};

    // Define special trip types and other types
    const specialTypes = ['onewayTrip', 'tenHours', 'eightHours', 'twelveHours'];
    const specificTypes = ['roundTrip', 'airportTrip'];

    // Handle type parameter
    if (type) {
        if (specialTypes.includes(type)) {
            // Special handling for specified trip types
            query[`${type}.isAvailable`] = "Yes";

            if (seats) {
                const seatCount = parseInt(seats, 10);
                if (isNaN(seatCount)) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Query parameter "seats" must be a valid number'
                    });
                }

                if (seatCount >= 8) {
                    // If seat count is 8 or more, return cars with exactly 7 seats
                    query.seats = 7;
                } else {
                    // Handle seat count less than 8 as usual
                    query.seats = { $gte: seatCount };
                }
            }
        } else if (specificTypes.includes(type)) {
            // Special handling for roundTrip and airportTrip
            query[`${type}.isAvailable`] = "Yes";

            if (seats) {
                const seatCount = parseInt(seats, 10);
                if (isNaN(seatCount)) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Query parameter "seats" must be a valid number'
                    });
                }

                if (seatCount > 20) {
                    // If seat count is greater than 20, return only cars with exactly 20 seats
                    query.seats = 20;
                } else if (seatCount > 12) {
                    // If seat count is greater than 12 but less than or equal to 20, return cars with 12 or more seats
                    query.seats = { $gte: 12 };
                } else {
                    // General seat filter logic for seat count less than or equal to 12
                    query.seats = { $gte: seatCount };
                }
            }
        } else {
            // General type handling for other types
            query.type = type;

            if (seats) {
                const seatCount = parseInt(seats, 10);
                if (isNaN(seatCount)) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Query parameter "seats" must be a valid number'
                    });
                }

                if (seatCount > 20) {
                    // If seat count is greater than 20, return only cars with exactly 20 seats
                    query.seats = 20;
                } else if (seatCount >= 8 && seatCount <= 11) {
                    // If seat count is 8, 9, 10, or 11, return cars with exactly 7 seats
                    query.seats = 7;
                } else if (seatCount > 12) {
                    // If seat count is greater than 12 but less than or equal to 20, return cars with 12 or more seats
                    query.seats = { $gte: 12 };
                } else {
                    // General seat filter logic for seat count less than or equal to 12
                    query.seats = { $gte: seatCount };
                }
            }
        }
    } else if (seats) {
        const seatCount = parseInt(seats, 10);
        if (isNaN(seatCount)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Query parameter "seats" must be a valid number'
            });
        }

        if (seatCount > 20) {
            // If seat count is greater than 20, return only cars with exactly 20 seats
            query.seats = 20;
        } else if (seatCount >= 8 && seatCount <= 11) {
            // If seat count is 8, 9, 10, or 11, return cars with exactly 7 seats
            query.seats = 7;
        } else if (seatCount > 12) {
            // If seat count is greater than 12 but less than or equal to 20, return cars with 12 or more seats
            query.seats = { $gte: 12 };
        } else {
            // General seat filter logic for seat count less than or equal to 12
            query.seats = { $gte: seatCount };
        }
    }

    console.log('Constructed Query:', query); // Debugging statement

    // Determine the sort order
    const sortOrder = sort === 'asc' ? 1 : -1; // Ascending order for 'asc', descending otherwise

    // Find the taxi details based on the query object and apply sorting
    const taxiDetails = await NewTaxiDetails.find(query)
        .sort({ seats: sortOrder }) // Replace `seats` with the desired field to sort by
        .select({
            id: 1,
            Name: 1,
            icon: 1,
            Image: 1,
            rate: 1,
            BootSpace: 1,
            seats: 1,
            Type: 1,
            IsAcCar: 1,
            [type]: 1 // Select the specified type object if provided
        });

    if (!taxiDetails.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'No taxi details found for the specified criteria'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            taxiDetails
        }
    });
});







exports.updateTaxiDetail = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    // Handle file uploads if present
    if (req.files) {
        const { icon, Image } = req.files;
        if (icon) updateData.icon = icon[0].filename;
        if (Image) updateData.Image = Image[0].filename;
    }

    // Validate ID
    if (!id) {
        return res.status(400).json({
            status: 'fail',
            message: 'No ID provided for update'
        });
    }

    // Parse fields from JSON strings to objects
    const fieldsToParse = ['onewayTrip', 'roundTrip', 'eightHours', 'tenHours', 'twelveHours', 'airportTrip'];
    fieldsToParse.forEach(field => {
        if (updateData[field]) {
            try {
                updateData[field] = JSON.parse(updateData[field]);
            } catch (error) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Invalid JSON format for ${field}`
                });
            }
        }
    });

    // Update the taxi details
    const updatedTaxiDetail = await NewTaxiDetails.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });

    if (!updatedTaxiDetail) {
        return res.status(404).json({
            status: 'fail',
            message: 'No taxi detail found with that ID'
        });
    }

    // Send the updated detail
    res.status(200).json({
        status: 'success',
        data: {
            taxiDetail: updatedTaxiDetail
        }
    });
});

exports.deleteTaxi = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Validate the taxi ID
    if (!id) {
        return next(new AppError('Taxi ID is required', 400));
    }

    // Find and delete the taxi document
    const deletedTaxi = await NewTaxiDetails.findByIdAndDelete(id);

    // Check if the taxi was found and deleted
    if (!deletedTaxi) {
        return res.status(404).json({
            status: 'fail',
            message: 'Taxi not found'
        });
    }

    // Send response for successful deletion
    res.status(200).json({
        status: 'success',
        message: 'Taxi successfully deleted'
    });
});
