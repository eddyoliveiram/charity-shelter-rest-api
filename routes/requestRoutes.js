const express = require('express');
const router = express.Router();
const { getProviderRequests, updateRequestStatus, deleteRequest  } = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/provider/:provider_id', authMiddleware, getProviderRequests);
router.put('/:request_id/status', authMiddleware, updateRequestStatus);
router.delete('/:request_id', authMiddleware, deleteRequest);
module.exports = router;
