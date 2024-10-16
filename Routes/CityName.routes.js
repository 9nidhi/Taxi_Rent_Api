const router = require('express').Router();
const {addcity,getroute,deletecity} =  require('../Controller/CityName.controller')

router.post('/addcity', addcity);
router.get('/getroute', getroute);
router.delete('/deletecity/:id', deletecity);
module.exports = router;    

