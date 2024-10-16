const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CityRouteSchema = new Schema({
    
    cityname: {
        type: String,
    },
    

}, { timestamps: true });


const CityRoute = mongoose.model('cityRoute', CityRouteSchema);

module.exports = CityRoute;
