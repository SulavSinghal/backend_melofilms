// server/routes/aboutUs.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AboutUs = require('../models/aboutUs'); // Adjust path as needed

// --- Multer Setup for DISTINCT file fields ---
const uploadPath = '/var/www/melofilms_uploads/aboutUs';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const safeFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9-._]/g, '')}`;
    cb(null, safeFilename);
  },
});

// IMPORTANT: We use .fields() to accept specifically named file arrays
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).fields([
    { name: 'ourStoryImage', maxCount: 1 },
    { name: 'teamImages', maxCount: 20 },
    { name: 'clientLogos', maxCount: 50 },
    { name: 'festivalImages', maxCount: 50 },
]);


// GET /api/aboutUs -> Unchanged, still fetches the whole document
router.get('/', async (req, res) => {
  try {
    let about = await AboutUs.findOne();
    if (!about) {
      console.log('No AboutUs doc found, creating one.');
      about = await new AboutUs({
        ourStory: { heading: "Default Heading", paragraph1: "test", imageUrl: "./image.png", stats: [{
          value: "10+", label: "Years of Experience" 
        }] },
        team: [], clients: [], festivals: [], awards: [],
      }).save();
    }
    res.status(200).json(about);
  } catch (err) {
    console.error('Error GET /api/aboutUs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/aboutUs/update -> Handles the FULL document update
router.put('/update', upload, async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const files = req.files; // files will be in { ourStoryImage: [...], teamImages: [...] }

        const about = await AboutUs.findOne();
        if (!about) {
            return res.status(404).json({ message: 'AboutUs document not found.' });
        }
        
        // Helper to map files to the data object
        const mapFilesToData = (dataArray, filesArray, urlField) => {
            if (dataArray && filesArray) {
                let fileIndex = 0;
                return dataArray.map((item) => {
                    if (item[urlField] === 'PLACEHOLDER_FOR_UPLOAD' && filesArray[fileIndex]) {
                        item[urlField] = `/uploads/aboutUs/${filesArray[fileIndex].filename}`;
                        fileIndex++;
                    }
                    return item;
                });
            }
            return dataArray;
        };
        
        // Handle the single story image
        if (files.ourStoryImage) {
            data.ourStory.imageUrl = `/uploads/aboutUs/${files.ourStoryImage[0].filename}`;
        }
        
        // Map all other image arrays
        data.team = mapFilesToData(data.team, files.teamImages, 'imageUrl');
        data.clients = mapFilesToData(data.clients, files.clientLogos, 'logoUrl');
        data.festivals = mapFilesToData(data.festivals, files.festivalImages, 'imageUrl');

        // Awards have no images, so no mapping is needed.

        // Update the entire document
        about.set(data);
        const updatedDoc = await about.save();
        res.status(200).json(updatedDoc);

    } catch (err) {
        console.error(`Error PUT /api/aboutUs/update:`, err);
        res.status(500).json({ message: 'Server error during update.' });
    }
});


module.exports = router;