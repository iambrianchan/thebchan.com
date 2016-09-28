// public/js/controllers/MainCtrl.js
angular.module('InstagramCtrl', []).controller('InstagramController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
	$scope.max_id;
	$scope.more = true;
	$scope.photos = [];

	function loadPhotos() {
			var photos;
			// var base_url = 'http://localhost:4000/api/feed/14672124/';
			var base_url = 'https://thebchan.herokuapp.com/api/feed/14672124/';
			var url = typeof $scope.max_id != 'undefined' ? base_url + '?max_id=' + $scope.max_id : base_url;
			$http.get(url)
			.then(function success(response) {
				photos = response.data.data;
				$scope.max_id = response.data.pagination.next_max_id;
				if (typeof $scope.max_id == 'undefined') {
					$scope.more = false;
				}
				for (var i = 0; i < photos.length; i++) {
					$scope.photos.push(photos[i]);
				}
			}, function error() {
				console.log('Error occurred when fetching photos.')
			})
	}
	loadPhotos();

	$scope.$watch("tab", function callback(newVal, oldVal) {
		if (newVal == "twitter") {
			$timeout(function() {
				twttr.widgets.load();
		    })
		}
	});
}]);