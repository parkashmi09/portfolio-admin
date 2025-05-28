const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /api/admin/contacts
// @access  Private (Admin)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ receivedAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single contact by ID
// @route   GET /api/admin/contacts/:id
// @access  Private (Admin)
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server Error');
  }
};


// @desc    Create a contact (e.g., from a public contact form)
// @route   POST /api/contacts (Note: This might be a public route, not /admin)
// @access  Public (or Private if only admin can create contacts internally)
exports.createContact = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({
      name,
      email,
      message,
    });
    const contact = await newContact.save();
    res.json(contact); // Or a success message
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a contact (e.g., mark as read)
// @route   PUT /api/admin/contacts/:id
// @access  Private (Admin)
exports.updateContact = async (req, res) => {
  const { isRead } = req.body;
  const contactFields = {};
  if (typeof isRead === 'boolean') contactFields.isRead = isRead;
  // Add other fields to update if necessary

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a contact
// @route   DELETE /api/admin/contacts/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server Error');
  }
}; 