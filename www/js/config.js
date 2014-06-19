/**
 * Created by shenxingchen on 2014/6/18.
 */
angular.module('bookStore.config', [])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/tab/reading');
        $stateProvider
            .state('tabs',
            {
                abstract: true,
                url: "/tab",
                templateUrl: 'templates/tabs.html',
                controller: 'tabsCtrl'
            })
            .state('tabs.fav',
            {
                url: '/fav',
                views: {
                    'fav': {
                        templateUrl: 'templates/fav.html',
                        controller: 'favCtrl'
                    }
                }

            })
            .state('tabs.list',
            {
                url: '/list',
                views: {
                    'list': {
                        templateUrl: 'templates/list.html',
                        controller: 'listCtrl'
                    }
                }

            })
            .state('tabs.reading',
            {
                url: '/reading',
                views: {
                    'reading': {
                        templateUrl: 'templates/reading.html',
                        controller: 'readingCtrl'
                    }
                }
            })
            .state('tabs.search',
            {
                url: '/search',
                views: {
                    'search': {
                        templateUrl: 'templates/search.html',
                        controller: 'searchPageCtrl'
                    }
                }
            })
            .state('result',
            {
                url: '/result/:q',
                templateUrl: 'templates/result.html',
                controller: 'resultCtrl'

            })
            .state('detail',
            {
                url: '/detail/:id',
                templateUrl: 'templates/detail.html',
                controller: 'detailCtrl'

            })
})
;