
const express = require('express');
const router = express.Router();
const users = require('../models/users.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', function (req,res) {
  const user = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password
  }
  users.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while register the user."
      });
    });

})

router.post('/authenticate', function (req,res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) return res.status(401).json({status: "error", message: "Invalid email/password!!!"});

  users.findAll({ where: { email: email } }), function (err, userInfo) {
    if (err) {
      return res.status(400).json({status: "error", message: "Bad request"});
    } else {
      if (bcrypt.compareSync(password, userInfo.password)) {
        const token = jwt.sign({id: userInfo.id}, req.app.get('secretKey'), {expiresIn: '1m'});
        const {name, email, mobile, id} = userInfo;
        res.send({status: "success", message: "Login Successfully...", data: {user: {name, email,mobile, id:id}, token: token}});
      } else {
        res.status(404).json({status: "error", message: "Invalid email/password!!!", data: null});
      }
    }
  }
});
module.exports = router;
