const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  studio_address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  working_hours: {
    type: String,
    required: true,
  },
  social_links: {
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
