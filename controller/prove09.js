const https = require('https');

module.exports.getPokemon = (req, res, next) => {
    var offset = req.query.page * 10 || 0;
    var url = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`;

    https.get(url, (response) => {
        var data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            var jsonData = JSON.parse(data).results;
            console.log(jsonData);
            res.render('pages/prove09', {
                data: jsonData,
                path: '/prove09',
                title: 'Prove Activity 09',
                page: +req.query.page || 0
            });

        });
    }).on('error', (error) => {
        console.log(error);
    })
}