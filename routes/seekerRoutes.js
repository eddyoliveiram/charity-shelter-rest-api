const express = require('express');
const router = express.Router();
const { createSeekerProfile, updateSeekerProfile, createRequest, cancelRequest } = require('../controllers/seekerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', createSeekerProfile);

router.put('/update', authMiddleware, updateSeekerProfile);
router.post('/request', authMiddleware, createRequest);
router.delete('/request/:id', authMiddleware, cancelRequest);

module.exports = router;
