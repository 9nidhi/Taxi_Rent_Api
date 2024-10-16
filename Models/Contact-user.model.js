const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactInfoSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: `Contact-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
    },
    address: {
        type: String, required: true
    },

    phoneno1: {
        type: String, required: true
    },
    phoneno2: {
        type: String, required: true
    },
    cmpName: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    cmpWebsite : {
        type: String, required: true
    },

}, { timestamps: true });


const contactInfo = mongoose.model('contactInfo', contactInfoSchema);

module.exports = contactInfo;
