const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carrequirementsSchema = new Schema({
    userId: { type: String, required: true, unique: false, ref: 'registartion' },
    carId: { type: String, required: true ,unique: false,ref: 'cardetails' },
    postID: {
        type: String,
        required: true,
        default: `POSTID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        immutable: true
    },
    gotCanceled: { type: Boolean },
    isCarAssign: { type: Boolean },
    fromCity: { type: String },
    formState: { type: String },
    toCity: { type: String},
    toState: { type: String },
    date: { type: String },
    time: { type: String },
    carType: { type: String },
    budget: { type: String },
    tripType: { type: String },
    forVerifiedPeople: { type: String },
    note: { type: String },
   
}, { timestamps: true });



const CarRequirements = mongoose.model('carrequirenments', carrequirementsSchema);

module.exports = CarRequirements;
