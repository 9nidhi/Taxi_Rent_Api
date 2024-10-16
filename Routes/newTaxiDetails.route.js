const router = require('express').Router();
const {addNewTaxiDetails,uploadImages,gettaxi,searchalldata,updateTaxiDetail,deleteTaxi} =  require('../Controller/newTaxiDetails.controller');


router.post('/addnewtaxidetails',uploadImages, addNewTaxiDetails);
router.get('/gettaxi', gettaxi);
router.get('/searchalldata', searchalldata);
// Route to update taxi details by ID
router.patch('/updateTaxi/:id',uploadImages, updateTaxiDetail);
router.delete('/deleteTaxi/:id', deleteTaxi);
// router.get('/serchTrip', serchTrip);


module.exports = router;
