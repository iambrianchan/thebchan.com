angular.module('myApp', ['ngRoute', 'appRoutes', 'ngSanitize', 'ui.bootstrap', 'nemLogging', 'uiGmapgoogle-maps', 'MainDir', 'BlogCtrl', 'InstagramCtrl', 'MapCtrl', 'TwitterCtrl', 'BlogService', 'AdminCtrl'])
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyA8l8STCfBE-JKWfz3BFMRWMtiuhroPDfY',
        v: '3.20',
        libraries: 'weather,geometry,visualization,places'
    });
});