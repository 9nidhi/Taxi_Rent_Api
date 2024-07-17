const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registartionSchema = new Schema({
    userId: {
		type: String,
        required: true,
        default: `USERID-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
 
	},
	username: {
		type: String,
	
	},
    useremail:{
        type: String,   
    },
    
    userphoneno:{
        type: String,   
    },
    usercity:{
        type: String,   
    },
    userstate:{
        type: String,   
    },
    userpincode:{
        type: String,   
    },
    userisVerified: {
        type: Boolean,  
    }
	
}, {timestamps: true});

const Registartion = mongoose.model('registartion', registartionSchema);

module.exports = Registartion;