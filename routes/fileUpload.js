const express = require('express');
const router = express.Router();
const fileUploadController = require('../controller/fileUploadController')
const  multer =require('multer');

const upload = multer({ dest: 'upload' })

router.post('/upload',upload.single('file'), async function (req,res) {
  console.log(req.body)
  // await fileUploadController(req.body)
})
module.exports = router;
