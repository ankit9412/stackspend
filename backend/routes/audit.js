const express = require('express');
const router = express.Router();
const { createAudit, regenerateSummary } = require('../controllers/auditController');

router.post('/', createAudit);
router.post('/summary', regenerateSummary);

module.exports = router;
