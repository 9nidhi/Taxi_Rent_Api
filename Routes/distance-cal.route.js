const router = require('express').Router();
const {addDistance} =  require('../Controller/distance-cal.controller')

router.get('/adddistance', addDistance);

module.exports = router;    

