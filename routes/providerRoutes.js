const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getProviders } = require('../controllers/providerController');
const router = express.Router();

router.get('/providers', authMiddleware, getProviders);

module.exports = router;
