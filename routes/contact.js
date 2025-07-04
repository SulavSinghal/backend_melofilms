// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/contact');

// POST: Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, inquiryType, message } = req.body;
    const contact = new ContactMessage({ name, email, inquiryType, message });
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// GET: Admin panel - Get all contact messages
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// routes/contact.js
router.delete('/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const contact = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
});


module.exports = router;
