var express = require('express');
var app = express();

app.get('/fetch', function (req, res) {

    var fet = require('./fetch');

    fet.fetch(req.query.isbn,function (data) {
        res.send(data)
    });
});

var server = app.listen(4000, function() {
    console.log('Listening on port %d', server.address().port);
});