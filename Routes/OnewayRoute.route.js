const router = require('express').Router();
const {addRoute,deletecity,editroute,getroutebycity,routdelete} =  require('../Controller/OnewayRoute.controller')


router.post('/addroute', addRoute);
router.delete('/deletecity/:id', deletecity);
router.patch('/editroute/:id/:routeIndex', editroute);
router.get('/getroutebycity', getroutebycity);
router.delete('/routdelete/:id/:routeIndex', routdelete);

module.exports = router;    

