const express = require('express');
const router = express.Router();
const { captureLead } = require('../controllers/leadController');

router.post('/', captureLead);

module.exports = router;
