const express = require('express');

const showRoomController = require('../../controller/project/showRoom');
const isAuth = require('../../middleware/is-auth')
const router = express.Router();

//middleware
router.get('/project', showRoomController.getCars);
router.get('/cars/:carId', showRoomController.getDetail);
router.get('/cart', isAuth, showRoomController.getCart);
router.post('/cart', isAuth, showRoomController.postCart);
router.post('/cart-remove-car', isAuth, showRoomController.postCartRemoveCar);
router.post('/increment-quantity', isAuth, showRoomController.postCart);
router.post('/decrement-quantity', showRoomController.postDecrementQuantity);
router.post('/create-order', isAuth, showRoomController.postOrder);
router.get('/orders', isAuth, showRoomController.getOrders);
module.exports = router;
