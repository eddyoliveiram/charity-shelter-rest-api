const express = require('express');
const router = express.Router();
const { getProviderRequests, updateRequestStatus } = require('../controllers/requestController'); // Ajuste no nome da função
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/provider/:provider_id', authMiddleware, getProviderRequests);
router.put('/:request_id/status', authMiddleware, updateRequestStatus);

module.exports = router;
