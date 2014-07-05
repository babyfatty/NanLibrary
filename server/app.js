var express = require('express');
var app = express();
var redis = require("redis");
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});
//client.set("key", "string val", redis.print);

app.get('/fetch', function (req, res) {

    var fet = require('./fetch');

    fet.fetch(req.query.isbn, function (data) {
        res.send(data);
    });
});

app.get("/fetch_rank", function (req, res) {


    var fetck_rank = require("./fetch_rank");
    var sum = 1;
    client.get('bookss',function(err,reply){
        if(reply===null){
            var list =[];
            fetck_rank.book_list(undefined, function (book) {
                list.push(book);
                if (sum === 20) {
                    client.set('bookss',JSON.stringify(list));
                    res.send(list);
                }
                sum += 1;
            });
        }else{
            res.send(reply);
            console.log(reply);

        }
    })

});

var server = app.listen(5000, function () {
    console.log('Listening on port %d', server.address().port);
});
