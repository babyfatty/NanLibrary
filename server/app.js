var express = require('express');
var douban = require('./douban_book');
var app = express();

app.get('/fetch', function (req, res) {

    var fet = require('./fetch');

    fet.fetch(req.query.isbn, function (data) {
        res.send(data);
    });
});

app.get("/fetch_rank", function (req, res) {
    var fetck_rank = require("./fetch_rank");
    var sum = 1;
    fetck_rank.book_list(undefined, function (book) {
        var rank = book.rank;
        douban.get_book_isbn(book.isbn,function(book){
            book.rank = rank;
            res.write(JSON.stringify(book));
        });
        if (sum === 100) {
            res.end();
        }
        sum += 1;
    });
});

var server = app.listen(4000, function () {
    console.log('Listening on port %d', server.address().port);
});
