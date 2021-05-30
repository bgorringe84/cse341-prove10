const express = require('express');
const { check, body } = require('express-validator');
const User = require('../../models/project/user');

const authController = require('../../controller/project/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login',
[
   body('email')
   .isEmail()
   .withMessage('Invalid E-Mail')
   .normalizeEmail(),

   body('password', 'Invalid Password')
   .isLength({ min: 4 })
   .isAlphanumeric()
   .trim()
]
, authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', 
[
   body('name')
   .notEmpty().withMessage('Name is Required'),

   check('email')
   .isEmail()
   .withMessage('Invalid E-Mail')
   .custom((value, { req }) => {
      return User.findOne({email: value})
      .then(userDoc => {
         if(userDoc) {
            return Promise.reject('E-Mail already registered, please retry.');
         }
      });
   })
   .normalizeEmail(),

   body('password', 'Password req: numbers & text only, minimum 5 characters')
   .isLength({ min: 5 })
   .isAlphanumeric()
   .trim(),

   body('confirmPassword')
   .trim()
   .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match!');
      }
      return true;   
    })
]
 , authController.postSignup);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

router.post('/logout', authController.postLogout);

module.exports = router;