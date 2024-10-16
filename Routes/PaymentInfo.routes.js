const router = require('express').Router();
const {addpaymentInfo,getpaymentinfo} =  require('../Controller/Paymentinfo.Controller');

router.post('/addpaymentinfo', addpaymentInfo);
router.get('/getpaymentinfo', getpaymentinfo);
// router.get('/serchtriptype', serchtriptype);


module.exports = router;