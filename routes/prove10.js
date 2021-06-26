const express = require('express');
    const router = express.Router();

    // Path to your JSON file, although it can be hardcoded in this file.
    const dummyData = require('../data/prove10/prove10-data.json')

    router.get('/fetchAll', (req, res, next) => {
      res.json(dummyData);
  });

    router.post('/insertName', (req, res, next) => {
      if (req.body.newName !== undefined) {
         const newName = req.body.newName;
         if (!dummyData.avengers.some(a => a.name === newName)) {
            dummyData.avengers.push({name: newName});
            res.sendStatus(200);
         }
      } else {
         res.sendStatus(400);
      }
    });

    router.get('/', (req, res, next) => {
      res.render('pages/prove10', {
          title: 'Prove Activity 10',
          path: '/Prove10'
      });
  });

    module.exports = router;