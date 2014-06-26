/**
 * Created by shenxingchen on 2014/6/18.
 */
angular.module('bookStore.controllers', [])
    .controller('MainCtrl', function ($scope, $ionicModal) {
        $scope.title = 'njulib';
        $scope.setTitle = function (val) {
            $scope.title = val;
        };

    })
    .controller('tabsCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal) {
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

    })
    .controller('listCtrl', function ($scope) {
        $scope.$parent.setTitle('榜单');
    })
    .controller('favCtrl', function ($scope) {
        $scope.$parent.setTitle('收藏');
    })
    .controller('readingCtrl', function ($scope) {
        $scope.$parent.setTitle('在读');
    })
    .controller('searchPageCtrl', function ($scope) {
        $scope.$parent.setTitle('查书');
    })
    .controller('searchCtrl', function ($scope, $state) {
        $scope.search = function () {
//            $scope.model.hide();
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
            $http.get('https://api.douban.com/v2/book/search', {params: {q: q,count:10,start:length}}).success(function (res) {
                $scope.books = $scope.books.concat(res.books);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                console.log(res.books);
            })

        };
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
//        $scope.loadMore();
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
            $http.get('https://api.douban.com/v2/book/'+id).success(function (res) {
                $scope.book = res;
                $scope.bookTitle=res.title;
                $scope.catalog=res.catalog;
                console.log(res.isbn13);
            })
        };
        $scope.loadReview=function(){
            var length = $scope.annotations.length;
            $http.get(' https://api.douban.com/v2/book/'+id+'/annotations',{params:{count:6,start:length}}).success(function (res) {
                $scope.annotations=$scope.annotations.concat(res.annotations);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                console.log($scope.annotations);
            })
        };
        var loadLib=function(){
             var isbn=$scope.book.isbn13;
            $http.get("http://www.shenxingchen.com:4000/fetch",{params:{'isbn': isbn}})
                .success(function(res){
                   console.log(res);
                   console.log(isbn);
                    $scope.inlibs=res;
                })
                .error(function(res){
                    console.log('fail');
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
            $scope.loadReview();
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
