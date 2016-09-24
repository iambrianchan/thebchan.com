angular.module('myApp', ['ngRoute', 'appRoutes', 'ngSanitize', 'ui.bootstrap', 'nemLogging', 'uiGmapgoogle-maps', 'MainDir', 'BlogCtrl', 'InstagramCtrl', 'MapCtrl', 'BlogService']).config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBMnD_DyBEfyLlSGa-9QfeSrcznwY5EE50',
        v: '3.20',
        libraries: 'weather,geometry,visualization,places'
    });
});