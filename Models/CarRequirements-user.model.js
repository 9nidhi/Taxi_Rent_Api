const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carrequirementsSchema = new Schema({
    // userId: { type: String, required: true, unique: false, ref: 'registartion' },
    // carId: { type: String, required: true ,unique: false,ref: 'cardetails' },
    // postID: {
    //     type: String,
    //     required: true,
    //     default: `POSTID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
    //     immutable: true
    // },
    // gotCanceled: { type: Boolean },
    // isCarAssign: { type: Boolean },
    // fromCity: { type: String },
    // formState: { type: String },
    // toCity: { type: String},
    // toState: { type: String },
    // date: { type: String },
    // time: { type: String },
    // carType: { type: String },
    // budget: { type: String },
    // tripType: { type: String },
    // forVerifiedPeople: { type: String },
    // note: { type: String },

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



const CarRequirements = mongoose.model('carrequirenments', carrequirementsSchema);

module.exports = CarRequirements;
