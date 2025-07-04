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

// POST /api/opportunity/add
router.post('/add', (req, res) => {
  console.log('POST /api/opportunity/add hit');

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
// in upcomingopp_route.js (or now opportunityRoutes.js)
router.get('/latest', async (req, res) => {
  try {
    const latestOpportunity = await Opportunity.findOne().sort({ createdAt: -1 });
    res.json(latestOpportunity);
  } catch (error) {
    console.error('Error fetching latest opportunity:', error);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
});

router.post('/test', (req, res) => {
  res.send('Test route works');
});


module.exports = router;
