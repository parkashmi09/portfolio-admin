const express = require('express');
const router = express.Router();
const { getContacts, getContactById, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const { sendContactNotification } = require('../services/emailService');
const Contact = require('../models/contactModel');

// Public routes - no authentication needed
router.post('/public', async (req, res) => {
  try {
    const { name, email, phone, service, message, source = 'Direct' } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    // Create contact in database
    const contact = new Contact({
      name,
      email,
      phone,
      service,
      message,
      source,
      date: new Date()
    });

    await contact.save();

    // Send email notifications
    await sendContactNotification({
      name,
      email,
      phone,
      service,
      message
    });

    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
});

// Admin routes - no authentication for now
// Get all contacts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.json({
      contacts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalContacts: total
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

module.exports = router; 