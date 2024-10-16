const router = require('express').Router();
const {serchtriptype,serchTrip} =  require('../Controller/TripType.Controller');


router.get('/serchtriptype', serchtriptype);
router.get('/serchTrip', serchTrip);


module.exports = router;