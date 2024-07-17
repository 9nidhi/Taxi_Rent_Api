const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Registartion = require('../Models/Registartion-user.model')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// add Use Profile
exports.addUserProfile = catchAsync(async (req, res, next) => {

    const data = req.body;

    if (!data) return next(new AppError('No data provided.', 400));
    const { username, useremail, userphoneno, usercity, userstate, userpincode, userisVerified } = data;

    if (!username) return next(new AppError('User Name is required.', 400));
    if (!useremail) return next(new AppError('User Email is required.', 400));
    if (!userphoneno) return next(new AppError('User Phone no is required.', 400));
    if (!usercity) return next(new AppError('User City is required.', 400));
    if (!userstate) return next(new AppError('User state is required.', 400));
    if (!userpincode) return next(new AppError('User Pincode is required.', 400));
    if (typeof userisVerified !== 'boolean') return next(new AppError('IsVerified Field is required and must be a boolean.', 400));

    const existingPhoneno = await Registartion.findOne({ userphoneno });

    if (existingPhoneno) {
        return res.status(400).json({
            status: 'fail',
            message: 'Phonenno is  already exists.',
        });
    }

    data.userId = `USERID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

    const newRegistraion = await Registartion.create(data);

    res.json({
        status: 'success',
        message: 'Registartion Data added successfully.',
        result: newRegistraion
    });
});



