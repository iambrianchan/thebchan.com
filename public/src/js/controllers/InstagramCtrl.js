angular.module('InstagramCtrl', []).controller('InstagramController', ['$scope', '$http', '$timeout', 'uiGmapGoogleMapApi', function($scope, $http, $timeout, uiGmapGoogleMapApi) {

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 3, options: {scrollwheel: false}};
	$scope.geographies = [];
	$scope.geoPhotos = [];
	$scope.searchbox = {};
	$scope.tab ='feed';
	$scope.photos = [];

	if ($('html').hasClass('js touch')) {

		$scope.markerevents = {
			mousedown: function(marker, eventName, model, args) {
				$scope.geoPhotos = [];
				$scope.geoPhotos.push(model);
			}
		};

		$scope.map.zoom = 2;
	}

	function loadPhotos() {
			var photos;
			var url = '/instagram';
			
			$http.get(url)
				.then(function success(response) {
					photos = response.data.data;

					for (var i = 0; i < photos.length; i++) {
						if (photos[i]) {
							$scope.photos.push(photos[i]);							
						}
					}

					loadGeoData($scope.photos);

					return;

				}, function error() {
					return console.log('Error occurred when fetching photos.');
				}
			);
	}
	loadPhotos();

	$scope.$watch("tab", function callback(newVal, oldVal) {
		if (newVal == "twitter") {
			$timeout(function() {
				twttr.widgets.load();
		    });
		}
	});

	 function loadGeoData(photos) {

	 	for (var i = 0; i < photos.length; i++) {

				$scope.geographies.push(photos[i]);

	 	}

	}
	
	function check(index, place, type) {
    	if ($.inArray(type, place.types)) {
    		var photo = index;
    		$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + photo.location.latitude + ',' + photo.location.longitude + '&key=AIzaSyDfT_pBfZwAw59bn3BkPrjiKPb_ylmXYUg')
	    		.then(function success(response) {
	    			var j = response.data.results.length;
	    			try {
		    			while ($.inArray(type, response.data.results[--j].types) == -1) {
		    			}

		    			if (response.data.results[j].formatted_address == place[0].formatted_address) {
		    				$scope.geoPhotos.push(photo);
		    			}
	    			}

	    			catch (err) {
	    			}

	    			return;
	    		}, function error() {
	    			return console.log('Unable to return geocode data');
	    		}
    		);
    	}
    }

	var events = {
    	places_changed: function (searchBox) {
        	var place = searchBox.getPlaces();
        	if (!place || place == 'undefined' || place.length === 0) {
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
        		check(item, place, type);
        	});
    	}
	};

	$scope.searchbox = { template: 'searchbox.tpl.html', events: events };

	$scope.selectMarker = function(gMarker, eventName, model) {
		$scope.geoPhotos = [];
		$scope.geoPhotos.push(model);
	};
}]);