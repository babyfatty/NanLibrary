var request = require('request');
var cheerio = require('cheerio');

var fetch=function(isbn,callback){

    request('http://calis2.nju.edu.cn:8080/opac/openlink.php?strSearchType=isbn&strText='+isbn
        , function (error, response, body) {

        $=cheerio.load(body);
        var a='http://calis2.nju.edu.cn:8080/opac/'+$('.book_list_info a').attr('href');

        request(a,function(error, response, body){
            $=cheerio.load(body);
            var arr=[];
            $('#item .whitetext').each(function(){
                var b=$(this).text().split('\n')
                var c={
                    "索书号":b[1].replace(/\t/g, "").replace(/ /g, ""),
                    "条码号":b[2].replace(/\t/g, "").replace(/ /g, ""),
                    "年卷期":b[3].replace(/\t/g, "").replace(/ /g, ""),
                    "校区—馆藏地":b[4].replace(/\t/g, "").replace(/ /g, ""),
                    "书刊状态":b[6].replace(/\t/g, "").replace(/ /g, "")
                };
                arr.push(c);
            });
            callback(arr);
        })

    })

}
exports.fetch = fetch;