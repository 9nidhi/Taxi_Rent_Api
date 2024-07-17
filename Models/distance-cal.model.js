const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const distanceSchema = new Schema({
   
	cityname1: {
		type: String,
	
	},
    cityname2:{
        type: String,   
    },
    
	
}, {timestamps: true});

const Distance = mongoose.model('distance', distanceSchema);

module.exports = Distance;