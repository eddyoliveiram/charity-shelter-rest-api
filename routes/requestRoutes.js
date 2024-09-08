const express = require('express');
const router = express.Router();
const { getProviderRequests } = require('../controllers/requestController'); // Ajuste no nome da função
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/provider/:provider_id', authMiddleware, getProviderRequests);

module.exports = router;
