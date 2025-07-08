const express = require('express');
const router = express.Router();
const Film = require('../models/films');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/auth'); 

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/var/www/melofilms_uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

//  Public: Get all films
router.get('/', async (req, res) => {
  try {
    const films = await Film.find();
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Public: Get film by ID
router.get('/:id', async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) return res.status(404).json({ message: 'Film not found' });
    res.status(200).json(film);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/films/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Film.countDocuments();
    const upcoming = await Film.countDocuments({ film_type: 'upcoming' });
    const produced = await Film.countDocuments({ film_type: 'production' });

    res.json({ total, upcoming, produced });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

//  Protected: Add a new film
router.post(
  '/',
  authMiddleware, //  Require login
  upload.fields([
    { name: 'film_banner', maxCount: 1 },
    { name: 'film_images', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const { film_name, film_genre, film_year, film_description,film_type,director_name} = req.body;
     const bannerPath = `/uploads/${req.files['film_banner'][0].filename}`;
const imagePaths = req.files['film_images']?.map(file => `/uploads/${file.filename}`) || [];

      const newFilm = new Film({
        film_banner: bannerPath,
        film_name,
        film_genre,
        film_year,
        film_images: imagePaths,
        film_type,
        film_description,
        director_name
      });

      await newFilm.save();
      res.status(201).json({ message: 'Film added successfully', film: newFilm });
    } catch (err) {
      res.status(500).json({ message: 'Error uploading film', error: err.message });
    }
  }
);

//  Protected: Update a film
router.put(
  '/:id',
  authMiddleware, // Require login
  upload.fields([
    { name: 'film_banner', maxCount: 1 },
    { name: 'film_images', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const film = await Film.findById(req.params.id);
      if (!film) return res.status(404).json({ message: 'Film not found' });

      const {
        film_name,
        film_genre,
        film_year,
        film_description,
        film_type,
        director_name,
      } = req.body;

      film.film_name = film_name || film.film_name;
      film.film_genre = film_genre || film.film_genre;
      film.film_year = film_year || film.film_year;
      film.film_description = film_description || film.film_description;
      film.film_type = film_type || film.film_type;
      film.director_name = director_name || film.director_name;
      
    if (req.files['film_banner']) {
  film.film_banner = `/uploads/${req.files['film_banner'][0].filename}`;
}
if (req.files['film_images']) {
  film.film_images = req.files['film_images'].map(file => `/uploads/${file.filename}`);
}

      await film.save();

      res.status(200).json({ message: 'Film updated successfully', film });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

//  Protected: Delete a film
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedFilm = await Film.findByIdAndDelete(req.params.id);
    if (!deletedFilm) return res.status(404).json({ message: 'Film not found' });
    res.status(200).json({ message: 'Film deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
