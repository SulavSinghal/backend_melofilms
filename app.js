const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Routes
const filmRoutes = require('./routes/films');
const adminRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const contactInfoRoutes = require('./routes/ContactInfoRoutes');
const aboutRoutes = require('./routes/aboutUs');
const oppurtunity = require('./routes/upcomingopp_route');

// Use Routes
app.use('/api/films', filmRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/aboutUs', aboutRoutes); 
app.use('/api/opportunities',oppurtunity);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
