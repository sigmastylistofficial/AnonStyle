const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileUrl: { type: String, unique: true },
  mainImage: { type: String },
  mainImageCaption: { type: String },
  settings: {
    notifications: { type: Boolean, default: true },
    privacy: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
