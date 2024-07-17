const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxidetalSchema = new Schema({
   
    id: {
        type: String,
        required: true,
        default: `CAR-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
    },
    car_name:{
        type: String
    },
    icon:{
        type:String
    },
    car_img:{
        type:String
    },
    rate:{
        type:String
    },
    bootspace:{
        type:String
    },
    seats:{
        type:Number
    },
    car_type:{
        type:String
    },
    isAcCar: { type: Boolean },

    
	
}, {timestamps: true});

const TaxiDetails = mongoose.model('taxidetails', taxidetalSchema);

module.exports = TaxiDetails;