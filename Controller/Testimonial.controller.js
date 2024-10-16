const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Testimonial = require('../Models/Testimonial.model');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, 'uploads/'); // Directory for images
        } else if (file.mimetype.startsWith('video')) {
            cb(null, 'uploads/videos/'); // Directory for videos
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Format the filename to avoid conflicts
    }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image or video file!'), false);
    }
};

// Create multer instance with the storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
});

// Middleware to handle image and video uploads
exports.uploadMedia = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

exports.addtestimonial = catchAsync(async (req, res, next) => {
    const image = req.files && req.files.image ? req.files.image[0].filename : undefined;
    const video = req.files && req.files.video ? req.files.video[0].filename : undefined;

    // Extract data from the request body
    const { name } = req.body;

    // Validate that required fields are provided
    if (!name || !video) {
        return res.status(400).json({
            status: 'fail',
            message: 'Name and video file are required'
        });
    }

    // Create a new testimonial
    const newTestimonial = await Testimonial.create({
        name,
        image,
        video
    });

    // Send response
    res.status(201).json({
        status: 'success',
        data: {
            testimonial: newTestimonial
        }
    });
});


exports.getTestimonial = catchAsync(async (req, res, next) => {
    const testimonials = await Testimonial.find(); 

    // If no testimonials are found
    if (!testimonials.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'No testimonials found'
        });
    }

    // Send response with the testimonials
    res.status(200).json({
        status: 'success',
        data: {
            testimonials
        }
    });
});

exports.deleteTestimonial = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
  
    if (!id) {
      return next(new Error('No id is provided!!'));
    }
  
    try {
      const deleteData = await Testimonial.findOneAndDelete({ _id: id });
      if (!deleteData) {
        return next(new Error('No testimonial found with the provided id.'));
      }
  
      res.json({
        msg: 'Delete successful!',
        status: 'success',
        result: deleteData
      });
    } catch (error) {
      next(error);
    }
});