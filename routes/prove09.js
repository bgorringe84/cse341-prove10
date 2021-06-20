const express = require('express');
const router = express.Router();
const prove09Controller = require('../controller/prove09');

router.get('/',prove09Controller.getPokemon);

module.exports = router;