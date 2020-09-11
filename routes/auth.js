const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const {SENDGRID_API, EMAIL}= require('../config/keys')



const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: SENDGRID_API
       
    },
  })
);

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
          profilePicUrl,
        });
        user
          .save()
          .then((user) => {
            console.log(user.email);
            transporter.sendMail({
              to: user.email,
              from: "juleahlam@gmail.com",
              subject: "signup success",
              html:
                "<h5>Welcome to instagram! You have successfully registered, enjoy the great features of the app.</h5>",
            });
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
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const {
              _id,
              name,
              email,
              following,
              followers,
              profilePicUrl,
            } = savedUser;
            res.json({
              token,
              user: { _id, name, email, followers, following, profilePicUrl },
            });
          } else {
            return res
              .status(422)
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

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "User does not exist." });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "juleahlam@gmail.com",
          subject: "password reset",
          html: `
          <p>You have requested a password reset.</p>
          <h5>Click on this <a href='${EMAIL}/reset/${token}'>link</a> to reset your password.</h5>
          `,
        });
        res.json({ message: "Check your email to reset your password." });
      });
    });
  });
});

router.post("/newPassword", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again session expired." });
      }
      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Password updated successfully!" });
        });
      });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
