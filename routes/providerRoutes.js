const express = require('express');
const router = express.Router();
const { createProviderProfile, updateProviderProfile, getAllProviders, getRandomProviders, handleRequest } = require('../controllers/providerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllProviders);
router.post('/create', authMiddleware, createProviderProfile);
router.put('/update', authMiddleware, updateProviderProfile);
router.get('/random', getRandomProviders);
router.put('/request/:id', authMiddleware, handleRequest);

module.exports = router;
