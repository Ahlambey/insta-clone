const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');







router.post("/signup", (req, res) => {
  const { name, email, password, profilePicUrl } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with this email." });
      }

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          profilePicUrl

        });
        user
          .save()
          .then((user) => {
            res.json({ message: "user saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});




router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please enter email and password." });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "invalid email or password." });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            // return res.status(200).json({ message: "successfully signed in." });
            const token = jwt.sign({_id: savedUser._id}, JWT_SECRET);
            const{_id, name, email, following, followers, profilePicUrl}= savedUser;
            res.json({token, user:{_id, name, email, followers, following, profilePicUrl}});
          } else {
            return res.status(422)
              .json({ error: "invalid email or password." });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
