const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - Allow all origins for development
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/looks', require('./routes/looks'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send('AnonStyle API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
