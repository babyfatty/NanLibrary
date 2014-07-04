/**
 * Created by shenshijun on 14-6-28.
 */
var request = require('superagent');
var cheerio = require('cheerio');
var redis = require("./redis");

var subjects = {
    "A": "马列主义、毛泽东思想、邓小平理论",
    "B": "哲学、宗教",
    "C": "社会科学总论",
    "D": "政治、法律",
    "E": "军事",
    "F": "经济",
    "G": "文化、科学、教育、体育",
    "H": "语言、文字",
    "I": "文学",
    "J": "艺术",
    "K": "历史、地理",
    "N": "自然科学总论",
    "O": "数理科学与化学",
    "P": "天文学、地球科学",
    "Q": "生物科学",
    "R": "医药、卫生",
    "S": "农业科学",
    "T": "工业技术",
    "U": "交通运输",
    "V": "航空、航天",
    "X": "环境科学,安全科学",
    "Z": "综合性图书"
};


var top_url = {
    base: "http://calis2.nju.edu.cn:8080",
    top_lend: "http://calis2.nju.edu.cn:8080/top/top_lend.php",
    top_score: "http://calis2.nju.edu.cn:8080/top/top_score.php",
    top_shelf: "http://calis2.nju.edu.cn:8080/top/top_shelf.php",
    top_book: "http://calis2.nju.edu.cn:8080/top/top_book.php"
};

function get_url(url, cls) {
    if (arguments[1]) {
        return url + "?cls_no=" + cls;
    } else {
        return url;
    }
}

function format_url(url) {
    return top_url.base + url.slice(2);
}

function resolve(raw_isbn) {
    var isbn = raw_isbn.split(" ")[0];
    var backslash_index = isbn.indexOf("/");
    if (backslash_index !== -1) {
        return isbn.substring(0, backslash_index);
    }
    return isbn;
}

exports.score_list = function (cls) {

};


exports.lend_list = function (cls) {

};


exports.shelf_list = function (cls) {

};

exports.book_list = function (cls, callback) {
    var fetch_url = get_url(top_url.top_book, cls);
    request.get(fetch_url)
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36")
        .end(function (res) {
            $ = cheerio.load(res.text);
            $("#underlinemenu+table>tr").slice(1).each(function () {
                var rank = $(this).children().first().text();
                var view_nums = $(this).children().last().text();
                var book_url = format_url($(this).find("a").attr("href"));
                request.get(book_url)
                    .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36")
                    .end(function (res) {
                        $ = cheerio.load(res.text);
                        var isbn = resolve($("#item_detail>dl").find("dt:contains(ISBN)").first().next().text());
                        var book = {
                            "rank": rank, "view_nums": view_nums, "book_url": book_url, "isbn": isbn
                        };
                        callback(book)
                    });
            });
        });
};





