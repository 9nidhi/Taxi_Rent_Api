const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    name : {
        type : String
    }, 
    email : {
        type : String,
        required : true
    },
    phoneNo:{
        type : String,
        required : true
    }
	
}, {timestamps: true});

const Login = mongoose.model('user', loginSchema);

module.exports = Login;