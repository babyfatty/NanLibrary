/**
 * Created by shenxingchen on 2014/6/18.
 */
angular.module('bookStore.controllers', [])
    .controller('MainCtrl', function ($scope, $ionicModal,$state) {
        $scope.title = 'njulib';
        $scope.setTitle = function (val) {
            $scope.title = val;

        };
        $scope.isLogin=false;
        $scope.setLogin=function(val){
            $scope.isLogin=val;
            localStorage.islogin=$scope.isLogin;
        };
        $scope.checkLogin=function(){
            if(!localStorage.islogin){
                $state.go('unLogin')
            }
        }

    })
    .controller('unlogCtrl',function($scope){
        $scope.start=function(){
            $scope.setLogin(true);
        }
    })
    .controller('tabsCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal,$state) {
        $scope.menuToggle = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $ionicModal.fromTemplateUrl('templates/search.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.settingsModal = modal;
        });
        $scope.openSearch = function () {
            $scope.settingsModal.show();
        };
        $scope.clear=function(){
            localStorage.clear();
            window.location.reload();
        }
    })
    .controller('listCtrl', function ($scope,$http) {
        $scope.$parent.setTitle('榜单');
        $scope.items = [];
        $scope.loadMore = function() {
            $http.get('/more-items').success(function(items) {

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
    })
    .controller('favCtrl', function ($scope) {
        $scope.$parent.setTitle('收藏');
        var storage = window.localStorage;
        $scope.books=[];
        for (var i=0, len = storage.length; i < len; i++){
            var key = storage.key(i);
            var value = storage.getItem(key);
            $scope.books.push(JSON.parse(value).data);
            if(key==="islogin"){
                $scope.books.pop(JSON.parse(value).data);
            }
        }
    })
    .controller('searchCtrl', function ($scope, $state) {

        $scope.$parent.checkLogin();
        $scope.$parent.setTitle('搜索');
        $scope.search = function () {
            $state.go('result', {q: $scope.q});
        }
    })
    .controller('resultCtrl', function ($scope, $stateParams, $window, $http) {
        var q = $stateParams.q;
        $scope.title = q;
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.books = [];
        $scope.loadMore = function () {
            var length=$scope.books.length;
            $http.get('https://api.douban.com/v2/book/search', {params: {q: q,count:10,start:length}})
                .success(function (res) {
                    if(res.books.length===0){
                        $scope.err="查无此书";
                        console.log($scope.err);
                    }else{
                        $scope.books = $scope.books.concat(res.books);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        console.log(res.books);
                    }

                })
                .error(function(data,status,headers,config){
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                })
        };
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });

    })
    .controller('detailCtrl', function ($scope, $stateParams, $window, $http) {
        var id = $stateParams.id;
        $scope.annotations=[];
        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.bookInfo=true;
        $scope.review=false;
        $scope.libInfo=false;

        var loadBook=function(){
            $http.get('https://api.douban.com/v2/book/'+id)
                .success(function (res) {
                $scope.book = res;
                $scope.bookTitle=res.title;
                $scope.catalog=res.catalog;

                $scope.star=localStorage.getItem(res.title);
                console.log( $scope.star);
                })
                .error(function(res){
                    console.log(res);
                })
                .then(function(res){
                $scope.fav=function(){
                    localStorage.setItem(res.data.title,JSON.stringify(res));
                    $scope.star=true;
                };
                $scope.unfav=function(){
                    localStorage.removeItem(res.data.title);
                    $scope.star=false;
                };
            })
        };
//        $scope.fav=function($scope){
//            localStorage.setItem($scope.book.title,JSON.stringify($scope.book));
//        };
        var loadReview=function(){
            var length = $scope.annotations.length;
            $http.get(' https://api.douban.com/v2/book/'+id+'/annotations').success(function (res) {
                $scope.annotations=$scope.annotations.concat(res.annotations);
                if(length===0){
                    $scope.err="暂无笔记"
                }
                console.log($scope.err);
            }).error(function(res){
                console.log(res);
            })
        };

        var loadLib=function(){
             var isbn=$scope.book.isbn13;
            $http.get("http://www.shenxingchen.com:4000/fetch",{params:{'isbn': isbn}})

                .success(function(res){
                   console.log(res);
                    $scope.inlibs=res;
                    if($scope.inlibs.length===0){
                        $scope.err="图书馆暂无此书"
                    }
                })
                .error(function(data,status,headers,config){
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                })
        };
        $scope.showBookInfo=function(){
            $scope.bookInfo=true;
            $scope.review=false;
            $scope.libInfo=false;
        };
        $scope.showLibInfo=function(){
            loadLib();
            $scope.bookInfo=false;
            $scope.review=false;
            $scope.libInfo=true;
        };
        $scope.showReview=function(){
            loadReview();
            $scope.bookInfo=false;
            $scope.review=true;
            $scope.libInfo=false;
        };
        loadBook();

    })
    .controller('anndetailCtrl', function ($scope, $stateParams, $window, $http) {
        var id = $stateParams.id;

        $scope.cancel = function () {
            $window.history.back();
        };
        var loadReview=function(){
            $http.get(' https://api.douban.com/v2/book/annotation/'+id).success(function (res) {

                $scope.annDetail=res;
            })
        };
            $scope.showReview=function(){
            loadReview();
            $scope.bookInfo=false;
            $scope.review=true;
            $scope.libInfo=false;
        };
        loadReview();

    })
