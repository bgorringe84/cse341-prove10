const Car = require('../../models/project/car');
const User = require('../../models/project/user');
const { validationResult } = require('express-validator');

exports.getAddCar = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/admin/add-car', {
      path: '/add-car',
      pageTitle: 'Add Car',
      errorMessage: message,
      oldInput: {
         name: '',
         startDate: '',
         endDate: '',
         number: '',
         price: '',
         imgUrl: '',
         description: ''
      },
      validationErrors: []
   });
};

exports.postAddCar = (req, res, next) => {
   const name = req.body.name;
   const startDate = req.body.startDate;
   const endDate = req.body.endDate;
   const number = req.body.number;
   const price = req.body.price;
   const imgUrl = req.body.imgUrl;
   const description = req.body.description;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).render('pages/project/admin/add-car', {
         path: '/add-car',
         pageTitle: 'Add Car',
         errorMessage: errors.array()[0].msg,
         oldInput: {
            name: name,
            startDate: startDate,
            endDate: endDate,
            number: number,
            price: price,
            imgUrl: imgUrl,
            description: description
         },
         validationErrors: errors.array()
      });
   }
   const car = new Car ({
      dates: [startDate, endDate],
      name: name,
      number: number,
      price: price,
      description: description,
      imgUrl: imgUrl,
      userId: req.user
   });
   console.log(car);
   car
   .save()
   .then(result => {
      res.redirect('/project');
   })
   .catch(err => {
      console.log(err);
   });
};

exports.getEditCarList = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   Car.find({ userId: req.user._id })
   .then(cars => {
      res.render('pages/project/admin/edit-car-list', {
      path: '/edit-car',
      pageTitle: 'Edit Car',
      errorMessage: message,
      cars: cars
   });
})
.catch(err => console.log(err));
};

exports.getEditCar = (req, res, next) => {
   const carId = req.params.carId;
   Car.findById(carId)
   .then(car => {
      if (!car) {
         return res.redirect('/edit-car');
      }
      let message = req.flash('error');
      if (message.length > 0) {
         message = message[0];
      } else {
         message = null;
      }
      res.render('pages/project/admin/edit-car', {
         pageTitle: 'Edit Car',
         path: '/edit-car',
         car: car,
         errorMessage: message,
         oldInput: {
            name: '',
            startDate: '',
            endDate: '',
            number: '',
            price: '',
            imgUrl: '',
            description: ''
      },
      validationErrors: []
      });
   })
   .catch(err => console.log(err));
};

exports.postEditCar = (req, res, next) => {
   const carId = req.body.carId;
   const newName = req.body.name;
   const newNumber = req.body.number;
   const newStartDate = req.body.startDate;
   const newEndDate = req.body.endDate;
   const newPrice = req.body.price;
   const newImgUrl = req.body.imgUrl;
   const newDescription = req.body.description;
  

   Car.findById(carId)
   .then(car => {
      if (car.userId.toString() !== req.user._id.toString()) {
         return res.redirect('/project');
      }
      car.name = newName;
      car.number = newNumber;
      car.dates[0] = newStartDate;
      car.dates[1] = newEndDate;
      car.price = newPrice;
      car.imgUrl = newImgUrl;
      car.description = newDescription;
      
      return car
      .save()
      .then(result => {
         res.redirect('/edit-car');
      });
      })
      .catch(err => console.log(err));
};

exports.postDeleteCar = (req, res, next) => {
   const carId = req.body.carId;
   Car.deleteOne({ _id: carId, userId: req.user._id })
   .then(() => {
      res.redirect('/edit-car');
   })
   .catch(err => console.log(err));
}
