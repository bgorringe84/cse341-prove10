const express = require('express');

const showRoomController = require('../../controller/project/showRoom');

const router = express.Router();

router.post('/remove-car', showRoomController.postRemoveCar);



module.exports = router;