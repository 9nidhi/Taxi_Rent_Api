const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cardetailsSchema = new Schema({
    userId: { type: String, required: true, unique: false, ref: 'registartion' },
    carId: {
        type: String,
        required: true,
        default: `CARID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        immutable: true
    },
    carname: { type: String },
    cartype: { type: String },
    seatCapacity: { type: String },
    isAcCar: { type: Boolean },
    vehicleNumber: { type: String,unique:true },
    FuelType: { type: String },
    carFront: { type: String },
    carBack: { type: String },
    carLeftSide: { type: String },
    carRightSide: { type: String },
    carInteriorFront: { type: String },
    carInteriorBack: { type: String },
    carRCBookFront: { type: String },
    carRCBookBack: { type: String }
}, { timestamps: true });



const CarDetails = mongoose.model('cardetails', cardetailsSchema);

module.exports = CarDetails;
