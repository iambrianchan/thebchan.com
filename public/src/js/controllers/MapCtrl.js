angular.module('MapCtrl', []).controller('MapController', ['$scope', '$http', 'uiGmapGoogleMapApi', function($scope, $http, uiGmapGoogleMapApi) {

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 3, options: {scrollwheel: false}};

	if ($('html').hasClass('js touch')) {
		$scope.markerevents = {
			mousedown: function(marker, eventName, model, args) {
				$scope.geoPhotos = [];
				$scope.geoPhotos.push(model);
			}
		}
		$scope.map.zoom = 2;
	}

	$scope.geographies = [];
	$scope.max_id;
	$scope.more = true;
	$scope.geoPhotos = [];
	$scope.searchbox = {};
	$scope.tab ='feed'

	var holder = [];
	 function loadGeoData(loadGeoData) {
	 	if ($scope.more == true) {
		 	var geoData;
			var base_url = "/api/map";
			var url = typeof $scope.max_id != 'undefined' ? base_url + '?max_id=' + $scope.max_id : base_url;
			$http.get(url)
			.then(function(response) {
				geoData = response.data.data;
				$scope.max_id = response.data.pagination.next_max_id;
				if (typeof $scope.max_id == 'undefined') $scope.more = false;
				for (var i = 0; i < geoData.length; i++) {
					if (geoData[i].location != null && holder.indexOf(geoData[i].location) == -1) {
						holder.push(geoData[i]);
					}
				}
				loadGeoData(loadGeoData);
			})
		} else $scope.geographies = holder;
	}
	
	loadGeoData(loadGeoData);

	function check(index, place, type) {
    	if ($.inArray(type, place.types)) {
    		var photo = index
    		$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + photo.location.latitude + ',' + photo.location.longitude + '&key=AIzaSyCMqpOb5lhkjZ2l4oEkt0UickUMUQmyl0E')
    		.then(function success(response) {

    			var j = response.data.results.length;
    			while ($.inArray(type, response.data.results[--j].types) == -1) {
    			};

    			if (response.data.results[j].formatted_address == place[0].formatted_address) {
    				$scope.geoPhotos.push(photo);
    			}
    			return;
    		}, function error() {
    			return console.log('Unable to return geocode data');
    		}
    	)}
    }

	var events = {
    	places_changed: function (searchBox) {
        	var place = searchBox.getPlaces();
        	if (!place || place == 'undefined' || place.length == 0) {
            	return;
        	}
        	$scope.map = {
            	"center": {
                	"latitude": place[0].geometry.location.lat(),
                	"longitude": place[0].geometry.location.lng()
            	},
            	"zoom": 5
        	};

        	var type = place[0].types[0];
        	$scope.geoPhotos = [];
        	$scope.geographies.forEach(function callback(item) {
        		check(item, place, type)
        	});
    	}
	};
	$scope.searchbox = { template: 'searchbox.tpl.html', events: events }

	$scope.selectMarker = function(gMarker, eventName, model) {
		$scope.geoPhotos = [];
		$scope.geoPhotos.push(model);
	}
}])