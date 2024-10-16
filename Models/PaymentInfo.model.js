const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentInfoSchema = new Schema({
    
    orderId: {
        type: String,
    },
    amount:{
        type: String,
    }
    

}, { timestamps: true });


const PaymentRoute = mongoose.model('PaymnetInfo', PaymentInfoSchema);

module.exports = PaymentRoute;
