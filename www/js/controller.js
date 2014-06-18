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
    .controller('moreCtrl', function ($scope) {
        $scope.$parent.setTitle('more');
    })
    .controller('searchCtrl', function ($scope, $state) {
        $scope.search = function () {
//            $scope.model.hide();
            $state.go('result', {q: $scope.q});

        }
    })
    .controller('resultCtrl', function ($scope, $stateParams, $window,$http) {
        var q=$stateParams.q;
        $scope.title =q;
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.books=[];
        $scope.loadMore=function(){
            var start = $scope.books.length;
            $http.get("https://api.douban.com/v2/book/search",{params: {q: q,start: start,count: 10}})
                .then(function(res){
                    $scope.books = $scope.books.concat(res.data.books);
                },function(res){}
            ).then(function(res){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }
        $scope.loadMore();
    })
