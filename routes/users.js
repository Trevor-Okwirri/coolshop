const express = require("express")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const SHA256 = require('crypto-js/sha256');
const User = require("../models/User.js")

dotenv.config()
const router = express.Router();

generateAccessToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_KEY, {
      expiresIn: '30m',
    });
  };

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
      return res.sendStatus(401);
    }
    user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) {
      return res.sendStatus(403);
    } else {
      res.send({ token: generateAccessToken(user) });
      return;
    }
  });
  
  router.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;
    user = await User.findOne({ refreshTokens: refreshToken });
    Tokens = user.refreshTokens;
    Tokens = Tokens.filter((token) => token !== req.body.token);
    await User.findOneAndUpdate({ email: user.email }, { refreshTokens: Tokens });
    res.send('Token succesfully deleted');
  });
  
  router.post('/login', async (req, res) => {
    users = await User.find();
    try {
      if (req.body.email != null) {
        User.findOne({ email: req.body.email }, async (err, user) => {
          if (err) {
            res.status(500).send({ msg: err.message });
          } else if (!user) {
            res.status(401).send({
              msg:
                'The email address ' +
                req.body.email +
                ' is not associated with any account. Please check and try again!',
            });
          } else if (SHA256(req.body.password) != user.password) {
            res.status(401).send({ msg: 'Wrong Password!' });
          } else if (!user.isVerified) {
            return res.status(401).send({
              msg: 'Your email has not yet been verified. Please click on resend to verify email.',
            });
          } else {
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user.email, process.env.JWT_KEY);
            const refreshTokens = user.refreshTokens;
            refreshTokens.push(refreshToken);
            await User.findOneAndUpdate(
              { name: user.name },
              { refreshTokens: refreshTokens }
            );
            return res.status(200).send({
              username: user.name,
              email: user.email,
              token: accessToken,
              refreshToken: refreshToken,
            });
          }
        });
      } else if (req.body.name) {
        User.findOne({ name: req.body.name }, async (err, user) => {
          if (err) {
            res.status(500).send({ msg: err.message });
          } else if (!user) {
            res.status(401).send({
              msg:
                'The email address ' +
                req.body.email +
                ' is not associated with any account. Please check and try again!',
            });
          } else if (SHA256(req.body.password) != user.password) {
            res.status(401).send({ msg: 'Wrong Password!' });
          } else if (!user.isVerified) {
            return res.status(401).send({
              msg: 'Your email has not yet been verified. Please click on resend to verify email.',
            });
          } else {
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user.email, process.env.JWT_KEY, {
              expiryIn: '7d',
            });
            const refreshTokens = user.refreshTokens;
            refreshTokens.push(refreshToken);
            await User.findOneAndUpdate(
              { name: user.name },
              { refreshTokens: refreshTokens }
            );
            return res.status(200).send({
              username: user.name,
              email: user.email,
              token: accessToken,
              refreshToken: refreshToken,
            });
          }
        });
      } else {
        res.send('Invalid credentials');
      }
    } catch (error) {
      res.send(req.body);
    }
  });
module.exports = router;