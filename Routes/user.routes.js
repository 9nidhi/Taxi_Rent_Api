const router = require('express').Router();
const {addUser, loginUsers, getUser, updateUsers, searchUser, deleteUser} =  require('../Controller/user.controller');


router.post('/signin', addUser);
router.post('/login', loginUsers);
router.get('/user-data',getUser );
router.put('/update-user/:id', updateUsers);
// router.get('/serach-user/:key', searchUser);
router.delete('/delete-user/:id',deleteUser);
router.get('/serach-user', searchUser);


module.exports = router;    

