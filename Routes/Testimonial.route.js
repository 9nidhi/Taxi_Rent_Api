const router = require('express').Router();
const {addtestimonial,uploadMedia,getTestimonial,deleteTestimonial} =  require('../Controller/Testimonial.controller');


router.post('/addtestimonial', uploadMedia, addtestimonial);
router.get('/getTestimonial', getTestimonial);
router.delete('/deletetestimonial/:id', deleteTestimonial);


module.exports = router;