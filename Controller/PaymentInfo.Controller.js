const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const PaymnetInfo = require('../Models/PaymentInfo.model');

const mongoose = require('mongoose');


exports.addpaymentInfo = catchAsync(async (req, res, next) => {
    const { amount, orderId } = req.body;

    // Check for required fields
    if (!amount || !orderId) {
        return next(new AppError('All fields (amount, orderId) are required', 400));
    }

    // Create a new contactInfo instance
    const newContact = await PaymnetInfo.create({
        amount,
        orderId
    });

    // Send response
    res.status(201).json({
        status: 'success',
        data: {
            paymentinfo: newContact
        }
    });
});


exports.getpaymentinfo = catchAsync(async (req, res, next) => {
    const cityname = await PaymnetInfo.find();

    if (!cityname.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Not found'
        });
    }

    return res.status(200).json({
        status: 'success',
        data: {
            cityname
        }
    });
});
