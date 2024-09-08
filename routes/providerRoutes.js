const express = require('express');
const router = express.Router();
const { createProviderProfile, updateProviderProfile, getAllProviders, getRandomProviders, handleRequest,getProviderProfile } = require('../controllers/providerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllProviders);
router.get('/:user_id/profile', getProviderProfile);
router.post('/create', createProviderProfile);
router.put('/update', authMiddleware, updateProviderProfile);
router.get('/random', getRandomProviders);
router.put('/request/:id', authMiddleware, handleRequest);

module.exports = router;
