// models/upcomingOpportunityModel.js
const mongoose = require('mongoose');

const upcomingOpportunitySchema = new mongoose.Schema({
  endsAt: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  bannerImg: {
    type: String, // Store image URL or filename
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('UpcomingOpportunity', upcomingOpportunitySchema);
