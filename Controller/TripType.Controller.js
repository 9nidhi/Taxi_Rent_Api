const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const TaxiDetails = require('../Models/TaxiDetail.models');
const TripType = require('../Models/TripType.Model');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
 
// exports.serchtriptype = catchAsync(async (req, res, next) => {
//     try {
//         const { type, ids } = req.query;
//         if (!type || !ids) {
//             return res.status(400).json({ error: 'Type and ids are required' });
//         }

//         const idsArray = ids.split(',').map(id => id.trim());

//         // Validate 'type'
//         if (!['oneway', 'roundtrip'].includes(type)) {
//             return res.status(400).json({ error: 'Invalid trip type' });
//         }

//         // Find or create a TripType document
//         let tripType = await TripType.findOne({ type });

//         if (!tripType) {
//             tripType = new TripType({ type });
//         }

//         // Find TaxiDetails documents by IDs
//         const taxis = await TaxiDetails.find({ '_id': { $in: idsArray } });

//         // Update TripType document with full taxi details
//         tripType.taxis = taxis;  // Storing full TaxiDetails data
//         await tripType.save();

//         // Retrieve and return the full TripType document
//         const updatedTripType = await TripType.findById(tripType._id).exec();

//         console.log('updatedTripType =>', updatedTripType);
//         res.status(200).json(updatedTripType);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


exports.serchtriptype = catchAsync(async (req, res, next) => {
    try {
        const { type, ids } = req.query;

        // Validate 'type'
        if (!['oneway', 'roundtrip'].includes(type)) {
            return res.status(400).json({ error: 'Invalid trip type' });
        }

        let taxis;

        // Fetch taxis based on type and ids
        if (type === 'oneway') {
            if (!ids) {
                return res.status(400).json({ error: 'IDs are required for oneway trips' });
            }
            const idsArray = ids.split(',').map(id => id.trim());
            taxis = await TaxiDetails.find({ '_id': { $in: idsArray } });

            // Find or create a TripType document for oneway
            let tripType = await TripType.findOne({ type });

            if (!tripType) {
                tripType = new TripType({ type });
            }

            // Update TripType document with full taxi details
            tripType.taxis = taxis;  // Storing full TaxiDetails data
            await tripType.save();

            // Retrieve and return the full TripType document
            const updatedTripType = await TripType.findById(tripType._id).exec();

            console.log('updatedTripType =>', updatedTripType);
            res.status(200).json(updatedTripType);
        } else if (type === 'roundtrip') {
            // Fetch all taxi details for roundtrip
            taxis = await TaxiDetails.find();

            // Remove existing roundtrip data from TripType
            await TripType.deleteMany({ type: 'roundtrip' });

            // Find or create a TripType document for roundtrip
            let tripType = new TripType({ type });

            // Update TripType document with full taxi details
            tripType.taxis = taxis;  // Storing full TaxiDetails data
            await tripType.save();

            // Retrieve and return the full TripType document
            const updatedTripType = await TripType.findById(tripType._id).exec();

            console.log('updatedTripType =>', updatedTripType);
            res.status(200).json(updatedTripType);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

exports.serchTrip = catchAsync(async (req, res, next) => {
    try {
        const { type } = req.query;

        // Validate 'type'
        if (!['oneway', 'roundtrip'].includes(type)) {
            return res.status(400).json({ error: 'Invalid trip type' });
        }

        // Find TripType document based on 'type'
        const tripType = await TripType.findOne({ type }).populate('taxis').exec();

        if (!tripType) {
            return res.status(404).json({ error: 'No data found for the specified trip type' });
        }

        // Return the found TripType document
        res.status(200).json(tripType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
