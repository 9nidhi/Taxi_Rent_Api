const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newTaxiDetailsSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: `CAR-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
    },
    Name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    Image: { type: String, required: true },
    BootSpace: { type: String, required: true },
    seats: { type: Number, required: true },
    Type: { type: String, required: true },
    IsAcCar: { type: String, required: true },
    onewayTrip: {
        isAvailable: { type: String, required: false },
        actualRatePerKM: { type: Number, required: false },
        discountRatePerKM: { type: Number, required: false }
    },
    roundTrip: {
        isAvailable: { type: String, required: false },
        actualRatePerKM: { type: Number, required: false },
        discountRatePerKM: { type: Number, required: false },
        perDayKMLimit: { type: Number, required: false }
    },
    eightHours: {
        isAvailable: { type: String, required: false },
        actualRateFix: { type: Number, required: false },
        discountRateFix: { type: Number, required: false },
        perKMRateOneway: { type: Number, required: false },
        bookingKMLimit: { type: Number, required: false }
    },
    tenHours: {
        isAvailable: { type: String, required: false },
        actualRateFix: { type: Number, required: false },
        discountRateFix: { type: Number, required: false },
        perKMRateOneway: { type: Number, required: false },
        bookingKMLimit: { type: Number, required: false }
    },
    twelveHours: {
        isAvailable: { type: String, required: false },
        actualRateFix: { type: Number, required: false },
        discountRateFix: { type: Number, required: false },
        perKMRateOneway: { type: Number, required: false },
        bookingKMLimit: { type: Number, required: false }
    },
    airportTrip: {
        isAvailable: { type: String, required: false },
        actualRatePerKM: { type: Number, required: false },
        discountRatePerKM: { type: Number, required: false }
    }
}, { timestamps: true });

const NewTaxiDetails = mongoose.model('NewTaxiDetails', newTaxiDetailsSchema);

module.exports = NewTaxiDetails;
