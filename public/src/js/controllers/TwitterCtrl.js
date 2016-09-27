// public/js/controllers/TwitterCtrl.js
angular.module('TwitterCtrl', []).controller('TwitterController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
        $timeout(function() {
        	twttr.widgets.load();
        })
}]);