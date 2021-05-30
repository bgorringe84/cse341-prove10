const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const User = require('../../models/project/user');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
      api_key: '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'
   }
}));

exports.getLogin = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message,
      oldInput: {
        email: '',
        password: ''
      },
      validationErrors: []
   });
};

exports.getSignup = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: {
         name: '',
         email: '',
         password: '',
         confirmPassword: ''
      },
      validationErrors: []
   });
   };

exports.postSignup = (req, res, next) => {
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).render('pages/project/auth/signup', {
         path: '/signup',
         pageTitle: 'Signup',
         errorMessage: errors.array()[0].msg,
         oldInput: { name: name, email: email, password: password, confirmPassword: req.body.confirmPassword },
         validationErrors: errors.array()
      });
   }
      bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
         const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            car: { items: [] }
         });
         user.save();
      })
      .then(result => {
         res.redirect('/login')
         return transporter.sendMail({
            to: email,
            from: 'someone@email.com',
            subject: 'E-Commerce-Project Registration',
            html: '<h1>Thank you for registering with the E-Commerce-Project! </h1>'
         })
      .catch(err => console.log(err));
   })
   .catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).render('pages/project/auth/login', {
         path: '/login',
         pageTitle: 'Login',
         errorMessage: errors.array()[0].msg,
         oldInput: {
            email: email,
            password: password
         },
         validationErrors: errors.array()
      });
   }
   User.findOne({ email: email })
   .then( user => {
      if (!user) {
         return res.status(422).render('pages/project/auth/login', {
            path: '/login',
         pageTitle: 'Login',
         errorMessage: 'Invalid email address',
         oldInput: {
            email: email,
            password: password
         },
         validationErrors: []
         });
      }
      bcrypt.compare(password, user.password).then( doMatch => {
         if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
               console.log(err);
               res.redirect('/project');
            });
         }
         return res.status(422).redirect('/login', {
            path: '/login',
         pageTitle: 'Login',
         errorMessage: 'Invalid password',
         oldInput: {
            email: email,
            password: password
         },
         validationErrors: []
         });   
      })
      .catch(err => {
         console.log(err);
         res.redirect('/login');
       });
   })
   .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/project');
   });
};

exports.getResetPassword = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/auth/reset-password', {
      path: '/reset-password',
      pageTitle: 'Reset Password',
      errorMessage: message
   });
   };

   exports.postResetPassword = (req, res, next) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.log(err);
          return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
          .then(user => {
            if (!user) {
              req.flash('error', 'No account with that email found.');
              return res.redirect('/reset-password');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
          })
          .then(result => {
            res.redirect('/project');
            transporter.sendMail({
              to: req.body.email,
              from: 'someone@node-project.com',
              subject: 'Password reset',
              html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:5000/reset/${token}">link</a> to set a new password.</p>
              `
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    };



