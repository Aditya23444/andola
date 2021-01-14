
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const welcomeMail = require('../controller/welcomeMail');
const userModel = require('../models/users.model');
var axios = require('axios')



router.post('/register',  function (req,res) {
  const user = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password
  }
   users.create(user)
    .then(async data => {
       await welcomeMail(
         {
           to : req.body.email,
           subject: 'Welcome Mail',
           body: 'Welcode to AndolaSoft'

       })

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

  userModel.findOne({email}, function (err, userInfo) {
    if (err) {
      return res.status(400).json({status: "error", message: "Bad request"});
    } else {
      if (bcrypt.compareSync(password, userInfo.password)) {
        const token = jwt.sign({id: userInfo._id}, 'TTTTTSqgsdDUGDG', {expiresIn: '1m'});
        const {name, email, gender, contact, role, _id} = userInfo;
        res.send({status: "success", message: "Login Successfully...", data: {user: {name, email, gender, contact, role, id:_id}, token: token}});
      } else {
        res.status(404).json({status: "error", message: "Invalid email/password!!!", data: null});
      }
    }
  });
});
module.exports = router;
