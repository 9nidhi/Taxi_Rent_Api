const router = require('express').Router();
const {addImagesGallery,uploadImages,getmemoryimg,updatememoryimg,deletmemoryimg} =  require('../Controller/GalleryImage.controller');


router.post('/addmemoryimg', uploadImages,addImagesGallery);
router.get('/getmemoryimg', getmemoryimg);
router.patch('/updatememoryimg/:id/:imageName', uploadImages,updatememoryimg);
router.delete('/deletememoryimg/:id/:imageName',deletmemoryimg);




module.exports = router;
