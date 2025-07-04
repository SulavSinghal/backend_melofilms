// routes/contactInfoRoutes.js
const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/contactInfo');

// GET contact info
router.get('/', async (req, res) => {
  const contact = await ContactInfo.findOne();
  res.json(contact);
});

// PUT to update contact info
router.put('/', async (req, res) => {
  const data = req.body;
  let contact = await ContactInfo.findOne();

  if (!contact) {
    contact = new ContactInfo(data);
  } else {
    Object.assign(contact, data);
  }

  await contact.save();
  res.json({ message: 'Contact Info updated successfully.' });
});

module.exports = router;
