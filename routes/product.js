
const express = require('express');
const router = express.Router();
const product = require('../models/product.model')
const AuthenticateUser = require('../authentication');


router.post('/create', AuthenticateUser, function (req,res) {

  product.create({
    name: req.body.name,
    image: req.body.image ? req.body.image : '',
    price: req.body.price
  }, function (err, result) {
    if (err)
      next(err);
    else
      res.json({status: "success", message: "product added successfully!!!", data: result});
  });
})
module.exports = router;
