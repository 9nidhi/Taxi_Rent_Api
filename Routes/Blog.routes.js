const router = require('express').Router();
const {addblog,uploadImages,editblog,getblog,deleteBlog} =  require('../Controller/Blog.controller');

router.post('/addblog', uploadImages,addblog);
router.patch('/editblog/:id', uploadImages,editblog);
router.get('/getblog', getblog);
router.delete('/deleteblog', deleteBlog);


module.exports = router;