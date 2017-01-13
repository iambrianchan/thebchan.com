// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
    
        .when('/', {
            templateUrl: 'public/src/views/partials/home.html'
        })

        .when('/resume', {
            templateUrl: 'public/src/views/partials/resume.html'
        })

        .when('/media', {
            templateUrl: 'public/src/views/partials/media.html',
            controller: 'InstagramController'
        })

        .when('/aboutme', {
            templateUrl: 'public/src/views/partials/aboutme.html',
        })

        .when('/blog', {
            templateUrl: 'public/src/views/partials/blog.html',
            controller: 'BlogController'
        })

        .when('/blog/:url', {
            templateUrl: 'public/src/views/partials/blog-detail.html',
            controller: 'BlogController'
        })

        .when('/login', {
            templateUrl: 'public/src/views/partials/login.html',
            controller: 'LoginController'
        })

        .when('/admin', {
            templateUrl: 'public/src/views/partials/admin.html',
            controller: 'BlogController'
        })
        .otherwise('/');

    $locationProvider.html5Mode(true);

}]);