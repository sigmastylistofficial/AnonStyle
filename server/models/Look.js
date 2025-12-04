const mongoose = require('mongoose');

const LookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  title: { type: String },
  links: [{
    title: String,
    url: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Look', LookSchema);
