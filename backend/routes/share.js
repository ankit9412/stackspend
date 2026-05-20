const express = require('express');
const router = express.Router();
const { getSharedAudit } = require('../controllers/shareController');

router.get('/:shareId', getSharedAudit);

module.exports = router;
