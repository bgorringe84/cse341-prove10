const express = require('express');
const {body} = require('express-validator');
const Car = require('../../models/project/car');

const adminController = require('../../controller/project/admin');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.get('/add-car', isAuth, adminController.getAddCar);
router.post('/add-car', 
[
   body('name')
      .isString()
      .trim()
      .custom ((value, {req}) => {
         return Car.findOne({ name: value })
         .then(userDoc => {
            if(userDoc) {
               return Promise.reject('Name is already used, please choose new name');
            }
         });
      }),

      body('startDate')
         .isNumeric()
         .isLength({ min: 4, max: 4 }),

      body('endDate'),

      body('number')
         .isAlphanumeric()
         .trim()
         .isLength({ min: 4 })
         .custom ((value, {req}) => {
            return Car.findOne({ number: value })
            .then(userDoc => {
               if(userDoc) {
                  return Promise.reject('Number is already used, please choose new number');
               }
            });
         }),

      body('price', 'Price must be in $$.¢¢ format')
         .isFloat(),

      // body('imgUrl', 'Must be a valid URL')
      //    .isURL(),

      body('description', 'description is required')
         .trim()
]
 , isAuth, adminController.postAddCar);

router.get('/edit-car', isAuth, adminController.getEditCarList);

router.get('/edit-car/:carId', 
[
   body('newName')
      .isString()
      .trim()
   ,

      body('newStartDate')
         .isNumeric()
         .isLength({ min: 4, max: 4 }),

      body('newEndDate'),

      body('newNumber')
         .isAlphanumeric()
         .trim()
         .isLength({ min: 4 })
      ,

      body('newPrice', 'Price must be in $$.¢¢ format')
         .isFloat(),

      // body('newImgUrl', 'Must be a valid URL')
      //    .isURL(),

      body('newDescription', 'description is required')
         .trim()
]
, isAuth, adminController.getEditCar);

router.post('/edit-car', 
[
   body('name')
      .isString()
      .trim()
      .custom ((value, {req}) => {
         return Car.findOne({ name: value })
         .then(userDoc => {
            if(userDoc) {
               return Promise.reject('Name is already used, please choose new name');
            }
         });
      }),

      body('startDate')
         .isDate({format: 'YYYY'})
         .withMessage("Start Date must be in 'YYYY' format"),

      body('endDate'),

      body('number')
         .isAlphanumeric()
         .trim()
         .isLength({ min: 4 })
         .custom ((value, {req}) => {
            return Car.findOne({ number: value })
            .then(userDoc => {
               if(userDoc) {
                  return Promise.reject('Number is already used, please choose new name');
               }
            });
         }),

      body('price')
         .isFloat(),

      // body('imgUrl')
      //    .isURL(),

      body('description')
         .trim()
] 
, isAuth, adminController.postEditCar);

router.delete('/car/:carId', isAuth, adminController.deleteCar);



module.exports = router;