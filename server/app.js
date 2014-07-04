var express = require('express');
var app = express();

app.get('/fetch', function (req, res) {

    var fet = require('./fetch');

    fet.fetch(req.query.isbn, function (data) {
        res.send(data);
    });
});

app.get("/fetch_rank", function (req, res) {
    var fetch_rank = require("./fetch_rank");
    var sum = 1;
    var list =[];
    fetch_rank.book_list(undefined, function (book) {
        list.push(book);
        if (sum === 20) {
            res.send(list);
        }
        sum += 1;
    });
});

var server = app.listen(4000, function () {
    console.log('Listening on port %d', server.address().port);
});
