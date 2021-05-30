const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(car) {
         const cartItemsIndex = this.cart.items.findIndex(ci => {
         return ci.carId.toString() === car._id.toString();
      });
      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];

      if (cartItemsIndex >= 0) {
         newQuantity = this.cart.items[cartItemsIndex].quantity + 1;
         updatedCartItems[cartItemsIndex].quantity = newQuantity;
      } else {
         updatedCartItems.push( { carId: car._id, quantity: newQuantity } );
      }
      const updatedCart = {
        items: updatedCartItems
      };
      this.cart = updatedCart;
      return this.save();
    };

userSchema.methods.removeItemFromCart = function(carId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.carId.toString() !== carId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.decrementQuantity = function(car) {
  const cartCarIndex = this.cart.items.findIndex(cp => {
    return cp.carId.toString() === car._id.toString();
  });
  let newQuantity = undefined;
  const updatedCartItems = {...this.cart.items};

  if (this.cart.items[cartCarIndex].quantity > 1){
    newQuantity = this.cart.items[cartCarIndex].quantity - 1;
    updatedCartItems[cartCarIndex].quantity = newQuantity;
    } 
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../../util/database').getDb;

// const ObjectId = mongodb.ObjectId;



// class User {
//    constructor(username, email, cart, id) {
//       this.name = username;
//       this.email = email;
//       this.cart = cart;
//       this._id = id;
//    }
//    save() {
//       const db = getDb();
//       return db.collection('users').insertOne(this);
//    }

//    addToCart(car) {
//       const cartItemsIndex = this.cart.items.findIndex(ci => {
//          return ci.carId.toString() === car._id.toString();
//       });
//       let newQuantity = 1;
//       const updatedCartItems = [...this.cart.items];

//       if (cartItemsIndex >= 0) {
//          newQuantity = this.cart.items[cartItemsIndex].quantity + 1;
//          updatedCartItems[cartItemsIndex].quantity = newQuantity;
//       } else {
//          updatedCartItems.push( { carId: new ObjectId(car._id), quantity: newQuantity } );
//       }
//       updatedCartItems
//       const updatedCart = {items: updatedCartItems };
//       const db = getDb();
//       return db
//          .collection('users')
//          .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: {cart: updatedCart}}
//          );
//    }


//    getCart() {
//       const db = getDb();
//       const carIds = this.cart.items.map(i => {
//         return i.carId;
//       });
//       return db
//         .collection('cars')
//         .find({ _id: { $in: carIds } })
//         .toArray()
//         .then(cars => {
//           return cars.map(p => {
//             return {
//               ...p,
//               quantity: this.cart.items.find(i => {
//                 return i.carId.toString() === p._id.toString();
//               }).quantity
//             };
//           });
//         });
//     }

//     removeItemFromCart(carId) {
//       const updatedCartItems = this.cart.items.filter(item => {
//          return item.carId.toString() !== carId.toString();
//       });
//       const db = getDb();
//       return db
//          .collection('users')
//          .updateOne(
//             { _id: new ObjectId(this._id)},
//             { $set: {cart: {items: updatedCartItems}}}
//          );
//     }


//     addOrder() {
//        const db = getDb();
//        return this.getCart()
//        .then(cars => {
//          const order = {
//           items: cars,
//           user: {
//              _id: new ObjectId(this._id),
//              name: this.name,
//              email: this.email
//           }
//        };
//        return db.collection('orders').insertOne(order);
//        })
//        .then(result => {
//           this.cart = {items: []};
//           return db
//           .collection('users')
//           .updateOne(
//              {_id: new ObjectId(this._id) },
//              { $set: { cart: { items: [] }}}
//           );
//        });
//     }

//     getOrders() {
//        const db = getDb();
//        return db
//        .collection('orders')
//        .find({'user._id': new ObjectId(this._id)})
//        .toArray();
//     };

//    static findById(userId) {
//       const db = getDb();
//       return db.collection('users')
//       .findOne({_id: new ObjectId(userId)})
//    }
// }

// module.exports = User;