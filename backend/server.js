require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-portal')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
