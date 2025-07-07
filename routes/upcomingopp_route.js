// routes/opportunityRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Opportunity = require('../models/upcomingopp');

// Upload folder path
const uploadPath = path.join(__dirname, '..', 'uploads', 'opportunities');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const safeFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9-._]/g, '')}`;
    cb(null, safeFilename);
  },
});
const upload = multer({ storage }).single('bannerImg');

// ✅ GET /api/opportunities – Fetch all
router.get('/', async (req, res) => {
  try {
    const all = await Opportunity.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// ✅ GET /api/opportunities/latest – Fetch most recent
router.get('/latest', async (req, res) => {
  try {
    const latest = await Opportunity.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (error) {
    console.error('Fetch Latest Error:', error);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
});

// ✅ POST /api/opportunities – Add new
router.post('/', (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    const { endsAt, title, desc } = req.body;
    const newOpportunity = new Opportunity({
      endsAt,
      title,
      desc,
      bannerImg: req.file ? `/uploads/opportunities/${req.file.filename}` : '',
    });

    try {
      const saved = await newOpportunity.save();
      res.status(200).json(saved);
    } catch (error) {
      console.error('Mongo Save Error:', error);
      res.status(500).json({ error: 'Failed to save opportunity' });
    }
  });
});

// ✅ PUT /api/opportunities/:id – Update
router.put('/:id', (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    const { endsAt, title, desc } = req.body;
    const updateData = { endsAt, title, desc };

    if (req.file) {
      updateData.bannerImg = `/uploads/opportunities/${req.file.filename}`;
    }

    try {
      const updated = await Opportunity.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Opportunity not found' });
      res.json(updated);
    } catch (error) {
      console.error('Update Error:', error);
      res.status(500).json({ error: 'Failed to update opportunity' });
    }
  });
});

// ✅ DELETE /api/opportunities/:id – Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Opportunity.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Opportunity not found' });

    if (deleted.bannerImg) {
      const imagePath = path.join(__dirname, '..', deleted.bannerImg);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Failed to delete image:', err.message);
      });
    }

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
});

module.exports = router;
