const { json } = require('express');
const https = require('https');

const ITEMS_PER_PAGE = 15   ;

module.exports.getItems = (req, res, next) => {
    var url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json';
    const page = req.query.page || 1;
    const indexStart = (page - 1) * ITEMS_PER_PAGE;
    const indexEnd = page * ITEMS_PER_PAGE;

    https.get(url, (response) => {
        var data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            var jsonData = JSON.parse(data);
            const { query } = req;
            const filter = query.search;
            if (query && filter) {
                jsonData = jsonData.filter(dataItem => dataItem.name.toUpperCase().indexOf(filter.toUpperCase()) > -1)
            }
            res.render('pages/prove08', {
                data: jsonData.slice(indexStart, indexEnd),
                path: '/prove08',
                title: 'Prove Activity 08',
                query: filter || '',
                page: page,
                numPages: Math.ceil(jsonData.length / ITEMS_PER_PAGE)
            });

        });
    }).on('error', (error) => {
        console.log(error);
    })
}