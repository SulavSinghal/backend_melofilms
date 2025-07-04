const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  film_banner: { type: String, required: true },
  film_name: { type: String, required: true },
  film_genre: { type: String, required: true },
  film_year: { type: Number, required: true },
  film_images: [{ type: String, required: true }],
  film_description: { type: String, required: true },
  film_type: {
  type: String,
  enum: ['upcoming', 'production','original'],
  required: true
},
createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Film', filmSchema);
