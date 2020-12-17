const express = require('express');
const router = express.Router();
const fileUploadController = require('../controller/fileUploadController')
const  multer =require('multer');

const upload = multer({ dest: 'path' })

router.post('/upload',upload.single('uri'), function (req,res) {
  console.log(req.body)

})
module.exports = router;
