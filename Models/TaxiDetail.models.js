// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const taxidetalSchema = new Schema({
   
//     id: {
//         type: String,
//         required: true,
//         default: `CAR-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
//     },
//     car_name:{
//         type: String
//     },
//     icon:{
//         type:String
//     },
//     car_img:{
//         type:String
//     },
//     rate:{
//         type:String
//     },
//     bootspace:{
//         type:String
//     },
//     seats:{
//         type:Number
//     },
//     car_type:{
//         type:String
//     },
//     roundtrip_rate:{
//         type:String
//     },
//     type: {
//         type: [String],
//         enum: ['oneway', 'roundtrip'],
//         required: true
//     },
//     isAcCar: { type: Boolean },
    
//     active_mode:{
//         type: String,  
//         default: 0,
//     }


	
// }, {timestamps: true});

// const TaxiDetails = mongoose.model('TaxiDetails', taxidetalSchema);

// module.exports = TaxiDetails;



const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxidetalSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: `CAR-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
    },
    car_name: { type: String },
    icon: { type: String },
    car_img: { type: String },
    rate: { type: String },
    bootspace: { type: String },
    seats: { type: Number },
    car_type: { type: String },
    roundtrip_rate: { type: String },
    hours: { type: Number },
    hourlyRate:{
        type:String
    },
    type: {
        type: [String],
        enum: ['oneway', 'roundtrip'],
        required: true
    },
    isAcCar: {  type: String},
    active_mode: { type: String, default: '0' }
}, { timestamps: true });

const TaxiDetails = mongoose.model('TaxiDetails', taxidetalSchema);

module.exports = TaxiDetails;
