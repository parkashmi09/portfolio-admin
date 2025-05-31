const express = require('express');
const router = express.Router();
const { getContacts, getContactById, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for public contact form submission (if applicable)
// This route should NOT have authMiddleware if it's for public use.
router.post('/public', createContact); // Example: /api/contacts/public

// All routes below are protected and accessible only by admin
router.use(authMiddleware);

router.route('/').get(getContacts);
router.route('/:id').get(getContactById).put(updateContact).delete(deleteContact);
// Admin might also want a way to create contacts internally, if so, add: router.route('/').post(createContact); under authMiddleware

module.exports = router; 