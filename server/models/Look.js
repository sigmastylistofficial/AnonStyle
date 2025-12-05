const mongoose = require('mongoose');

const LookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true }, // Main look image
  title: { type: String },
  links: [{
    title: String,
    url: String,
    imageUrl: { type: String } // Optional item image
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Look', LookSchema);
