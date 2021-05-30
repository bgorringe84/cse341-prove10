//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();
const ta03Controller = require('../controller/ta03');

router.get('/',ta03Controller.getItems);

module.exports = router;