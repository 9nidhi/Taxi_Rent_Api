const router = require('express').Router();
const {addUserProfile} =  require('../Controller/Registartion-user.controller')

router.post('/adduserprofile', addUserProfile);


module.exports = router;    

