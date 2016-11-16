// public/js/controllers/AdminCtrl.js
angular.module('AdminCtrl', []).controller('AdminController', ['$scope', '$http', '$window', function($scope, $http, $window) {

	$scope.credentials = {};
	$scope.image = "";
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

	$scope.add = function() {
		var f = document.getElementById('file').files[0],
		r = new FileReader();
		r.onloadend = function(e) {
			var data = e.target.result;
			$scope.image = data

			var img = document.createElement("img");
			img.src = $scope.image;
			document.getElementById("bucket").appendChild(img);
		}
		r.readAsDataURL(f);
	}
	
}]);