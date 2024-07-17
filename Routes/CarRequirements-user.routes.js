const router = require('express').Router();
const {addCarRequirenment,serchfromcity,getcarrequirenment} =  require('../Controller/CarRequirements-user.controller')

router.post('/addcarrequirments/:carId', addCarRequirenment);
router.post('/addcarrequirments/:carId', addCarRequirenment);
router.get('/serchfromcity',serchfromcity);
router.get('/getcarrequirenment',getcarrequirenment)



module.exports = router;    

