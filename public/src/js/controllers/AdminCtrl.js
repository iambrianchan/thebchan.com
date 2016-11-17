// public/js/controllers/AdminCtrl.js
angular.module('AdminCtrl', []).controller('AdminController', ['$scope', '$http', '$window', function($scope, $http, $window) {

	$scope.credentials = {};
	$scope.image = "";

	// handle login
	$scope.login = function() {

		if (!$scope.credentials.username) {

			return window.alert("Missing username");
		}

		else if (!$scope.credentials.password) {

			return window.alert("Missing password");
		}

		else {

			$http.post("/login", { username: $scope.credentials.username, password: $scope.credentials.password })

			.then(function onSuccess() {

				return $window.location.href = '/admin';

			}, function onError(error) {

				return window.alert("Incorrect credentials");
				
			});
		}
	};
	
}]);