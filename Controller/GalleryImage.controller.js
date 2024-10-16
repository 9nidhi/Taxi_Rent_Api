const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const MemoryImg = require('../Models/GalleryImage.model');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    },
});

const upload = multer({ storage: storage });

// Middleware to handle multiple file uploads
exports.uploadImages = upload.array('memoryImgs', 25);

exports.addImagesGallery = catchAsync(async (req, res, next) => {
    // const { placeName } = req.body;
    // // Extract filenames only
    // const memoryImgs = req.files.map(file => path.basename(file.path));

    // const newMemoryImg = new MemoryImg({
    //     placeName,
    //     memoryImgs
    // });

    // await newMemoryImg.save();

    // res.status(201).json({
    //     status: 'success',
    //     data: newMemoryImg
    // });
    const { placeName } = req.body;
    const memoryImgs = req.files.map(file => path.basename(file.path));

    try {
        // Find the existing entry by placeName
        let existingMemoryImg = await MemoryImg.findOne({ placeName });

        if (existingMemoryImg) {
            // If the place exists, append new images to the existing array
            existingMemoryImg.memoryImgs.push(...memoryImgs);
            await existingMemoryImg.save();
        } else {
            // If the place doesn't exist, create a new entry
            existingMemoryImg = new MemoryImg({
                placeName,
                memoryImgs
            });
            await existingMemoryImg.save();
        }

        res.status(201).json({
            status: 'success',
            data: existingMemoryImg
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error uploading images',
            error: error.message
        });
    }
});

exports.getmemoryimg = catchAsync(async (req, res, next) => {
    const { placeName } = req.query;

    let memoryImgs;

    if (placeName) {
        // Find documents matching the placeName
        memoryImgs = await MemoryImg.find({ placeName });

        if (memoryImgs.length === 0) {
            return next(new AppError('No images found for the given place name', 404));
        }
    } else {
        // No placeName provided, fetch all documents
        memoryImgs = await MemoryImg.find();

        if (memoryImgs.length === 0) {
            return next(new AppError('No images found', 404));
        }
    }

    res.status(200).json({
        status: 'success',
        data: memoryImgs
    });
});

exports.updatememoryimg = catchAsync(async (req, res, next) => {
    const { id, imageName } = req.params; // Get ID and image name from URL parameters
    const { placeName } = req.body; // Optional: New place name

    // Check if files are uploaded
    const imageFiles = req.files ? req.files.map(file => file.filename) : [];

    // Find the document by ID
    const memoryImg = await MemoryImg.findById(id);

    if (!memoryImg) {
        return next(new AppError('No document found with that ID', 404));
    }

    // Update placeName if provided
    if (placeName) {
        memoryImg.placeName = placeName;
    }

    // Check if the image name is provided and if a new image is uploaded
    if (imageName && imageFiles.length > 0) {
        const imageIndex = memoryImg.memoryImgs.indexOf(imageName);

        // Ensure imageName exists in the array
        if (imageIndex !== -1) {
            memoryImg.memoryImgs[imageIndex] = imageFiles[0]; // Replace the image with the new one
        } else {
            return next(new AppError('Image name not found in the array', 400));
        }
    }

    // Save the updated document
    const updatedMemoryImg = await memoryImg.save();

    res.status(200).json({
        status: 'success',
        data: {
            memoryImg: updatedMemoryImg
        }
    });
});

exports.deletmemoryimg = catchAsync(async (req, res, next) => {
    const { id, imageName } = req.params;

    const memoryImg = await MemoryImg.findById(id);

    if (!memoryImg) {
        return res.status(404).json({
            status: 'fail',
            message: 'No memory image found with that ID'
        });
    }

    // Remove the image from memoryImgs array
    const imageIndex = memoryImg.memoryImgs.indexOf(imageName);
    if (imageIndex > -1) {
        memoryImg.memoryImgs.splice(imageIndex, 1);

        // Remove the image file from the server
        const imagePath = path.join(__dirname, '../uploads', imageName);
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting image file:', err);
        });

        await memoryImg.save();

        res.status(200).json({
            status: 'success',
            data: memoryImg
        });
    } else {
        res.status(404).json({
            status: 'fail',
            message: 'No image found with that name'
        });
    }
});