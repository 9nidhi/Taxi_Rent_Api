const _ = require('lodash');
const http = require('http');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Distance = require('../Models/distance-cal.model'); // Assuming Distance model is imported
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const googleMapsApiKey = "AIzaSyB8WzQfww2uDUeO0mWCUHUskY0Y-FiRH2o";
console.log('googleMapsApiKey =>', googleMapsApiKey);

exports.addDistance = catchAsync(async (req, res, next) => {
  const { cityname1, cityname2 } = req.body;

  if (!cityname1 || !cityname2) {
    return res.status(400).json({ status: 'error', message: 'Please provide both city names.' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(cityname1)}&destinations=${encodeURIComponent(cityname2)}&key=${googleMapsApiKey}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('Failed to fetch distance data');
    }

    const distance = response.data.rows[0].elements[0].distance.value / 1000; // Distance in kilometers
    const durationInSeconds = response.data.rows[0].elements[0].duration.value;
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    let durationString;
    if (hours > 0) {
      durationString = `${hours} hr ${minutes} min`;
    } else {
      durationString = `${minutes} min ${seconds} sec`;
    }

    res.json({
      status: 'success',
      message: 'Distance and duration calculated successfully.',
      result: {
        cityname1,
        cityname2,
        distance,
        duration: durationString
      }
    });
  } catch (error) {
    console.error('Error calculating distance and duration:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to calculate distance and duration.' });
  }
});






