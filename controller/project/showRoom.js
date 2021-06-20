const Car = require('../../models/project/car');
const Order = require('../../models/project/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.getCars = (req, res, next) => {
   Car.find()
   .then(cars => {
      res.render('pages/project/showRoom', {
         cars: cars,
         pageTitle: 'ShowRoom',
         path: '/project',
         isAuthenticated : req.session.isLoggedIn,
         csrfToken: req.csrfToken()
      });
   })
   .catch(err => {
      console.log(err);
   });
};

exports.getDetail = (req, res, next) => {
   const carId = req.params.carId;
   Car.findById(carId)
      .then( car => {
         res.render('pages/project/car-detail', {
            car: car,
            pageTitle: car.name,
            path:'/cars',
            isAuthenticated : req.session.isLoggedIn
         });
      })
      .catch(err => {
         console.log(err)});
};

   exports.getCart = (req, res, next) => {
      req.user
        .populate('cart.items.carId')
        .execPopulate()
        .then(user => {
          const cars = user.cart.items;
          let total = 0;
          cars.forEach(c => {
            total += c.quantity * c.carId.price;
          })
          res.render('pages/project/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cars: cars,
            isAuthenticated: req.session.isLoggedIn,
            totalPrice : total
          });
        })
        .catch(err => console.log(err));
    };

exports.postCart = (req, res, next) => {
   const carId = req.body.carId;
   Car.findById(carId)
     .then(car => {
       return req.user.addToCart(car);
     })
     .then(result => {
       console.log(result);
       res.redirect('/cart');
     })
     .catch(err => console.log(err));
 };

exports.postCartRemoveCar = (req, res, next) => {
   const carId = req.body.carId;
   req.user
      .removeItemFromCart(carId)
      .then(result => {
         res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.postDecrementQuantity = (req, res, next) => {
  const carId = req.body.carId;
  Car.findById(carId)
  .then(car => {
    return req.user.decrementQuantity(car);
  })
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  });
};

exports.getCheckout = (req, res, next) => {
  req.user
        .populate('cart.items.carId')
        .execPopulate()
        .then(user => {
          const cars = user.cart.items;
          let total = 0;
          cars.forEach(c => {
            total += c.quantity * c.carId.price;
          })
          res.render('pages/project/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout Page',
            cars: cars,
            isAuthenticated: req.session.isLoggedIn,
            totalSum: total
          });
        })
        .catch(err => console.log(err));
    };

exports.postOrder = (req, res, next) => {
   req.user
     .populate('cart.items.carId')
     .execPopulate()
     .then(user => {
       const cars = user.cart.items.map(i => {
         return { quantity: i.quantity, car: { ...i.carId._doc } };
       });
       const order = new Order({
         user: {
           name: req.session.user.name,
           userId: req.session.user
         },
         cars: cars,
       });
       return order.save();
     })
     .then(result => {
       return req.user.clearCart();
     })
     .then(() => {
       res.redirect('/orders');
     })
     .catch(err => console.log(err));
 };
 
 exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.session.user._id})
     .then(orders => {
       res.render('pages/project/orders', {
         path: '/orders',
         pageTitle: 'Your Orders',
         orders: orders,
         isAuthenticated : req.session.isLoggedIn
       });
     })
     .catch(err => console.log(err));
 };

 exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'project', 'invoices', invoiceName);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {underline: true});
      pdfDoc.text('------------------------------');
      let totalPrice = 0;
      order.cars.forEach(car => {
        totalPrice += car.quantity * car.car.price;
        pdfDoc.fontSize(14).text(car.car.name + ' - ' + car.quantity + ' x $' + car.car.price);
      });
      pdfDoc.fontSize(26).text('------------------------------');
      pdfDoc.fontSize(20).text('Total Price $' + totalPrice);

      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      //   file.pipe(res);
    })
    .catch(err => next(err));
};
