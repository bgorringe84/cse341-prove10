const Car = require('../../models/project/car');
const Order = require('../../models/project/order');
const User = require('../../models/project/user');

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
          res.render('pages/project/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cars: cars,
            isAuthenticated: req.session.isLoggedIn
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

// exports.postCartRemoveCar = (req, res, next) => {
//    const carNumber = req.body.carNumber;
//    Car.findByNumber(carNumber, car => {
//       Cart.removeCar(carNumber, car.price);
//       res.redirect('/cart');
//    });
// };

// exports.postRemoveCar = (req, res, next) => {
//    const carNumber = req.body.carNumber;
//    Car.removeByNumber(carNumber);
//    res.redirect('/cart')
// };