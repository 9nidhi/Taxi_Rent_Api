const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Blog = require('../Models/Blog.model');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    },
});

const upload = multer({ storage: storage });


exports.uploadImages = upload.array('image', 25);


exports.addblog = catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('No images uploaded!', 400));
    }

    const imagePaths = req.files.map(file => file.filename);

    const { name, long_description,short_description,keyword } = req.body;

    if (!name || !long_description || !short_description || !keyword) {
        return next(new AppError('Name and long_description and keyword are required!', 400));
    }

    const newBlog = new Blog({
        name,
        keyword,
        image: imagePaths,
        long_description,
        short_description
    });

    await newBlog.save();

    res.status(201).json({
        status: 'success',
        data: {
            blog: newBlog
        }
    });
});


exports.editblog = catchAsync(async (req, res, next) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
        return next(new AppError('Blog not found!', 404));
    }

    const { name, long_description,short_description,keyword } = req.body;

    if (!name || !long_description ||!short_description || !keyword) {
        return next(new AppError('Name and long_description and keyword are required!', 400));
    }

    if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map(file => file.filename);
        blog.image = imagePaths;
    }

    blog.name = name;
    blog.long_description = long_description; 
    blog.keyword = keyword;
    blog.short_description = short_description;

    await blog.save();

    res.status(200).json({
        status: 'success',
        data: {
            blog
        }
    });
});


exports.getblog = catchAsync(async (req, res, next) => {
    const contacts = await Blog.find();

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


exports.deleteBlog = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
  
    if (!id) {
      return next(new Error('No id is provided!!'));
    }
  
    try {
      const deleteData = await Blog.findOneAndDelete({ _id: id });
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
