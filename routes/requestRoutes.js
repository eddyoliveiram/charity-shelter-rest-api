const express = require('express');
const router = express.Router();
const { getSeekerRequests, getProviderRequests } = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/seeker/:seeker_id', authMiddleware, getSeekerRequests);
router.get('/provider/:provider_id', authMiddleware, getProviderRequests);

module.exports = router;
