const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/users')
dotenv.config()
mongoose.connect(
  process.env.MONGO_URL
);
const app = express();
//installing our routes
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('Server listening on port 7000'));
app.use('/api', userRoutes);
app.listen(7000, () => {
  console.log(`Server listening on port 7000`);
});

module.exports = app;