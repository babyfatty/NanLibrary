/**
 * Created by shenxingchen on 2014/6/18.
 */
angular.module('bookStore.config', [])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/tab');
        $stateProvider
            .state('tabs',
            {
                abstract: true,
                url: "/tab",
                templateUrl: 'templates/tabs.html',
                controller: 'tabsCtrl'
            })
            .state('tabs.more',
            {
                url: '/more',
                views: {
                    'more': {
                        templateUrl: 'templates/more.html',
                        controller: 'moreCtrl'
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
            .state('result',
            {
                url: '/result/:q',
                templateUrl: 'templates/result.html',
                controller: 'resultCtrl'
//                views:{
//                    resultView:{
//
//                    }
//                }

            })
})
;