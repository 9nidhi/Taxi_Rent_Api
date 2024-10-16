const router = require('express').Router();
const {addContact,getcontact,updateContact } =  require('../Controller/Contact-user.controller');


router.post('/addcontact', addContact);
router.get('/getcontact', getcontact);
// Route to update a contact by ID
router.patch('/updatecontact/:id', updateContact);

// router.get('/serchTrip', serchTrip);


module.exports = router;
    