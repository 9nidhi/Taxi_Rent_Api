const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonialSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: `test-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
    },
    name: { type: String },
    image: { type: String },
    video: { type: String },
   
}, { timestamps: true });



const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
