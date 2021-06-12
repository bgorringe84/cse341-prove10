const express = require('express');
const router = express.Router();
const prove08Controller = require('../controller/prove08');

router.get('/',prove08Controller.getItems);

module.exports = router;