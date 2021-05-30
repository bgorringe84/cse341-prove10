const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
   dates: {
      type: Array,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   number: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   imgUrl: {
      type: String,
      required: true
   },
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
});

module.exports = mongoose.model('Car', carSchema);

// const mongodb = require('mongodb');
// const getDb = require('../../util/database').getDb;


// class Car {

//    save() {
//       const db = getDb();
//       db.collection('cars')
//          .insertOne(this)
//          .then(result => {
//             console.log(result);
//          })
//          .catch(err => {
//             console.log(err);
//          });
//    }
   
//    static fetchAll() {
//       const db = getDb();
//       return db
//          .collection('cars')
//          .find()
//          .toArray()
//          .then(cars => {
//             console.log(cars);
//             return cars;
//          })
//          .catch(err => {
//             console.log(err);
//          });
//    }

//    static findById(carId) {
//       const db = getDb();
//       return db
//          .collection('cars')
//          .find({ _id: new mongodb.ObjectId(carId) })
//          .next()
//          .then(car => {
//             console.log(car);
//             return car;
//          })
//          .catch(err => { console.log(err)
//          });
//    }

// };

// module.exports = Car;

