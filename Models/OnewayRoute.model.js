const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oneWayRouteSchema = new mongoose.Schema({
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CityName',
        required: true
    },
    routeNames: {
        type: [String], // Array of strings
        required: true
    },
    cityName: {
        type: String,
        required: true
    }
});



const OneWayRoute = mongoose.model('oneWayRoute', oneWayRouteSchema);

module.exports = OneWayRoute;
