const express = require('express');
const router = express.Router();
const { getLogos, getLogoById, createLogo, updateLogo, deleteLogo } = require('../controllers/logoController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.route('/').get(getLogos).post(createLogo);
router.route('/:id').get(getLogoById).put(updateLogo).delete(deleteLogo);

module.exports = router; 