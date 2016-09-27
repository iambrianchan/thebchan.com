// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'src/views/partials/home.html'
        })

        .when('/resume', {
            templateUrl: 'src/views/partials/resume.html'
        })

        .when('/media', {
            templateUrl: 'src/views/partials/media.html',
            controller: 'MapController'
        })

        .when('/aboutme', {
            templateUrl: 'src/views/partials/aboutme.html',
        })

        .when('/blog', {
            templateUrl: 'src/views/partials/blog.html',
            controller: 'BlogController'
        })

        .when('/blog/:url', {
            templateUrl: 'src/views/partials/blog-detail.html',
            controller: 'BlogController'
        })
        .when('/twitter', {
            templateUrl: 'src/views/partials/twitter.html',
            controller: 'TwitterController'
        })
        .when('/admin/:url', {
            templateUrl: 'src/views/partials/admin-blog-detail.html',
            controller: 'BlogController'
        })

        .when('/admin', {
            templateUrl: 'src/views/partials/admin.html',
            controller: 'BlogController'
        })

        .when('/login', {
            templateUrl: 'src/views/partials/login.ejs'
        })

    $locationProvider.html5Mode(true);

}]);