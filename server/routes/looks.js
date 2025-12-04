const express = require('express');
const router = express.Router();
const Look = require('../models/Look');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Create a look
router.post('/', auth, async (req, res) => {
  try {
    const newLook = new Look({
      user: req.user.id,
      imageUrl: req.body.imageUrl,
      title: req.body.title,
      links: req.body.links
    });
    const look = await newLook.save();
    res.json(look);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get looks by username (public profile)
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const looks = await Look.find({ user: user.id }).sort({ createdAt: -1 });
    res.json(looks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
