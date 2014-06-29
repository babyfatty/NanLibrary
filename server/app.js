var express = require('express');
var app = express();

app.get('/fetch', function (req, res) {

    var fet = require('./fetch');

    fet.fetch(req.query.isbn, function (data) {
        res.send(data)
    });
});

app.get("/fetch_rank", function (req, res) {
    var fetck_rank = require("./fetch_rank");
    fetck_rank.book_list(undefined, function (book) {
        res.send(book);
    });
});

var server = app.listen(4000, function () {
    console.log('Listening on port %d', server.address().port);
});
