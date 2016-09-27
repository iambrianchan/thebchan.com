angular.module('myApp', ['ngRoute', 'appRoutes', 'ngSanitize', 'ui.bootstrap', 'nemLogging', 'uiGmapgoogle-maps', 'MainDir', 'BlogCtrl', 'InstagramCtrl', 'MapCtrl', 'TwitterCtrl', 'BlogService']).config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCMqpOb5lhkjZ2l4oEkt0UickUMUQmyl0E',
        v: '3.20',
        libraries: 'weather,geometry,visualization,places'
    });
});