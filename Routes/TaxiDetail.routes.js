const router = require('express').Router();
const {addtaxiDetails,uploadImages,getTaxidetails,getsearchsets,deletetaxidetail,updatetaxidetail} =  require('../Controller/TaxiDetail.Controller');

router.post('/addtaxidetails', uploadImages, addtaxiDetails);
router.get('/getTaxidetails',getTaxidetails);
router.get('/getsearchsets',getsearchsets);
router.delete('/deletetaxidetail/:id',deletetaxidetail);
router.patch('/updatetaxidetail/:id',uploadImages, updatetaxidetail);


module.exports = router;