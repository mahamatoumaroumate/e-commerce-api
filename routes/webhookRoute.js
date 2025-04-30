// routes/webhookRoute.js
const express = require('express');
const router = express.Router();
const webhookHandler = require('../controllers/webhookController');

// Note: you do NOT re-apply bodyParser.raw() here,
// because it’s already been applied in app.js
router.post('/webhook', webhookHandler);

module.exports = router;
