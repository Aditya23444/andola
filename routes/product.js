
const express = require('express');
const router = express.Router();
const product = require('../models/product.model')
const AuthenticateUser = require('../authentication');


router.post('/create', AuthenticateUser, function (req,res) {
const Product = {
  name: req.body.name,
  image: req.body.image ? req.body.image : '',
  price: req.body.price
}
  product.create(Product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });
})
module.exports = router;
