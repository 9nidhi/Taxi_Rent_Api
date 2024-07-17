const express = require('express');
const router = express.Router();
const { addCarDetails,deleteCarDetails,getcarType,getcarrdetails} = require('../Controller/Cardetails-user.controller');
const upload = require('../utils/multer-config');

router.post('/addcardetails/:userID', addCarDetails);
router.delete('/deletecardetails/:carId', deleteCarDetails);
router.get('/getcartype',getcarType);
router.get('/getcarrdetails',getcarrdetails)

module.exports = router;
