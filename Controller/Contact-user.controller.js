const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const contactInfo = require('../Models/Contact-user.model');

const mongoose = require('mongoose');


exports.addContact = catchAsync(async (req, res, next) => {
    const { address, phoneno1, phoneno2, cmpName,cmpWebsite ,email} = req.body;

    // Check for required fields
    if (!address || !phoneno1 || !phoneno2 || !cmpName || !cmpWebsite || !email) {
        return next(new AppError('All fields (address, phoneno1, phoneno2, cmpName,cmpWebsite ,email) are required', 400));
    }

    // Create a new contactInfo instance
    const newContact = await contactInfo.create({
        address,
        phoneno1,
        phoneno2,
        cmpName,
        cmpWebsite ,email
    });

    // Send response
    res.status(201).json({
        status: 'success',
        data: {
            contact: newContact
        }
    });
});

exports.getcontact = catchAsync(async (req, res, next) => {
    const contacts = await contactInfo.find();

        if (!contacts.length) {
            return res.status(404).json({
                status: 'fail',
                message: 'No contacts found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                contacts
            }
        });
});

exports.updateContact = catchAsync(async (req, res, next) => {
    const { id } = req.params;  // Fix to use `req.params` directly
    console.log('id =>', id);

    const { address, phoneno1, phoneno2, cmpName,cmpWebsite ,email } = req.body;
    console.log('req.body =>', req.body);

    // Validate the contact ID
    if (!id) {
        return next(new AppError('Contact ID is required', 400));
    }

    // Validate the data to be updated (at least one field must be provided)
    if (!address && !phoneno1 && !phoneno2 && !cmpName) {
        return next(new AppError('At least one field to update is required', 400));
    }

    // Update the contact information
    const updatedContact = await contactInfo.findByIdAndUpdate(
        id,
        { address, phoneno1, phoneno2, cmpName,cmpWebsite,email },
        { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedContact) {
        return next(new AppError('No contact found with that ID', 404));
    }

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            contact: updatedContact
        }
    });
});