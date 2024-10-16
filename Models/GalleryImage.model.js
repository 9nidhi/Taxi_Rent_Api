const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memorySchema = new Schema({
   
	memoryImgs: [
        {
            type: String,
            required: true
        }
    ],
    placeName:{
        type:String,
        require:true
    }
	
}, {timestamps: true});

const MemoryImg = mongoose.model('memoryImg', memorySchema);

module.exports = MemoryImg;