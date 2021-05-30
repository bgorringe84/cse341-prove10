const { json } = require('express');
const https = require('https');

module.exports.getItems = (req, res, next) => {
    var url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json';

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
            res.render('pages/ta03', {
                title: 'Team Activity 03',
                path: '/ta03', // For pug, EJS 
                activeTA03: true, // For HBS
                contentCSS: true, // For HBS
                data: jsonData,
                query: filter || ''
            });

            // var outputFilename = 'my.json';

            //    fs.writeFile(outputFilename, JSON.stringify(jsonResponse, null, 4), function(err) {
            //       if(err) {
            //          console.log(err);
            //       } else {
            //          console.log("JSON saved to " + outputFilename);
            //       }
            //    }); 
        });
    }).on('error', (error) => {
        console.log(error);
    })
}