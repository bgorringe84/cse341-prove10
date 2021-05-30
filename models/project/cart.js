// const fs = require('fs');
// const path = require('path');

// const c = path.join(
//    path.dirname(require.main.filename),
//    'data/project',
//    'cart.json'
//    );

// module.exports = class Cart {
//    static addCar(number, price) {
//       fs.readFile(c, (err, data) => {
//          let cart = {cars: [], totalPrice: 0};
//          if (!err) {
//             cart = JSON.parse(data);
//          }
//          const existingCarIndex = cart.cars.findIndex(car => car.number === number);
//          const existingCar = cart.cars[existingCarIndex];
//          let updatedCar;
//          if (existingCar) {
//             updatedCar = {...existingCar};
//             updatedCar.qty = updatedCar.qty + 1;
//             cart.cars = [...cart.cars];
//             cart.cars[existingCarIndex] = updatedCar;
//          } else {
//             updatedCar = { number: number, qty: 1};
//             cart.cars = [...cart.cars, updatedCar];
//          }
//          cart.totalPrice = cart.totalPrice + +price;
//          fs.writeFile(c, JSON.stringify(cart), err => {
//             console.log(err);
//          });
//       });
//    }

//    static removeCar(number, carPrice) {
//       fs.readFile(c, (err, data) => {
//          if (err) {
//             return;
//          }
//          const updatedCart = { ...JSON.parse(data) };
//          const car = updatedCart.cars.find(car => car.number === number);
//          const carQty = car.qty;
//          updatedCart.cars = updatedCart.cars.filter(car => car.number !== number)
//          updatedCart.totalPrice = Cart.totalPrice - carPrice * carQty;
//          fs.writeFile(c, JSON.stringify(updatedCart), err => {
//             console.log(err);
//          });
//       });
//    }

//    static getCart(cb) {
//       fs.readFile(c, (err, data) => {
//          const cart = JSON.parse(data);
//          if (err) {
//             cb(null);
//          } else {
//             cb(cart);
//          }
//       });
//    }
// };