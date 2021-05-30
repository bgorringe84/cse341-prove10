//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself! 
const express = require('express');
const router = express.Router();

const names = ['Joel', 'Lautaro', 'Nic']
let message = '';

router.get('/', (req, res, next) => {
    res.render('pages/ta02', {
        found: message,
        names,
        title: 'Team Activity 02',
        path: '/ta02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

router.post('/addUser', (req, res, next) => {
    let username = req.body.username;
    let found = false;
    for (var i = 0; i < names.length; i++) {
        if (names[i] === username) {
            found = true;
        }
    }
    found || names.push(username);
    message = found ? 'Then name already exists in the list' : '';
    res.redirect('/ta02/');
});

router.post('/removeUser', (req, res, next) => {
    let username = req.body.username;
    let found = false;
    for (var i = 0; i < names.length; i++) {
        if (names[i] === username) {
            found = true;
            names.splice(i, 1);
        }
    }
    message = found ? '' : "the name doesn't exists in the list";
    res.redirect('/ta02/');
});

module.exports = router;