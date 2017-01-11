var myapp = angular.module('myApp', ['ngRoute', 'appRoutes', 'ngSanitize', 'ui.bootstrap', 'nemLogging', 'uiGmapgoogle-maps', 'angular-google-analytics', 'MainDir', 'BlogCtrl', 'InstagramCtrl', 'MapCtrl', 'TwitterCtrl', 'BlogService', 'AdminCtrl']);

myapp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyA8l8STCfBE-JKWfz3BFMRWMtiuhroPDfY',
        v: '3.20',
        libraries: 'weather,geometry,visualization,places'
    });
});
myapp.config(['AnalyticsProvider', function (AnalyticsProvider) {

   AnalyticsProvider.setAccount('UA-89957529-1');
   
}]).run(['Analytics', function(Analytics) { }]);