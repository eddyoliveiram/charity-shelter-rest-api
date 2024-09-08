const express = require('express');
const router = express.Router();
const { createProviderProfile, updateProviderProfile, getAllProviders, getRandomProviders, handleRequest,getProviderProfile } = require('../controllers/providerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', createProviderProfile);
router.get('/random', getRandomProviders);

router.get('/all/:user_id', authMiddleware, getAllProviders);
router.get('/:user_id/profile', authMiddleware, getProviderProfile);
router.put('/update', authMiddleware, updateProviderProfile);
router.put('/request/:id', authMiddleware, handleRequest);

module.exports = router;
