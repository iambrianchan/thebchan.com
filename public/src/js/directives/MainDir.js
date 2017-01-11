angular.module('MainDir', [])

// binds clicks on document
.directive('shapes', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {

			var container;
		    var camera, scene, renderer;
		    var geometry, group;
		   	var mouseX = 0, mouseY = 0;
		    var windowHalfX = window.innerWidth / 2;
		    var windowHalfY = window.innerHeight / 2;

		    var elements = $('#main a, #main span')
		    var time = 200;
		    $.each(elements, function(index, value) {
		    	var elem = this;
		    	setTimeout(function(){
		    		$(elem).css('opacity', 1);
		    	}, time += 400)
		    })

		    $(document).ready(function() {
		     	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		      	init();
		       	animate();  
		    });
    
    		function init() {

		        container = document.getElementById( 'wrapper' );
		        document.body.appendChild( container );

		        camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 1, 20000 );
		        camera.position.z = 500;

		       	scene = new THREE.Scene();

		        var geometries = [];
		        for(var i=0; i < 2000; i++) {
		       	   	var geometry = new THREE.Geometry();
		           	var x = Math.random() * 100;
		   	     	var y = Math.random() * 100;
		       	   	var v1 = new THREE.Vector3(0,0,0)
		           	var v2 = new THREE.Vector3(0,y,0)
		           	var v3 = new THREE.Vector3(x,0,0)
		           	geometry.vertices.push(v1)
		           	geometry.vertices.push(v2)
		           	geometry.vertices.push(v3)
		           	geometry.faces.push(new THREE.Face3(0,2,1));
		           	geometries[i] = geometry;
		       	}

		       var materials = [
			       new THREE.MeshPhongMaterial({
			       // light
			       specular: '#b03b2e',
			       // intermediate
			       color: '#a31a0b',
			       // dark
			       emissive: '#FF7F66',
			       shininess: 80 ,
			       transparent: true,
			       opacity: 0.7,
			       overdraw: true
			   	}),
			       new THREE.MeshPhongMaterial({
			       // light
			       specular: '#2fa4b1',
			       // intermediate
			       color: '#0b94a3',
			       // dark
			       emissive: '#7ECEFD',
			       shininess: 80 ,
			       transparent: true,
			       opacity: 0.7,
			       overdraw: true
			  	}),
			       new THREE.MeshPhongMaterial({
			       // light
			       specular: '#b03b2e',
			       // intermediate
			       color: '#a31a0b',
			       // dark
			       emissive: '#FFDF48',
			       shininess: 80 ,
			       transparent: true,
			       opacity: 0.7,
			       overdraw: true
			   	}),
			       new THREE.MeshPhongMaterial({
			       // light
			       specular: '#b03b2e',
			       // intermediate
			       color: '#a31a0b',
			       // dark
			       emissive: '#0070B1',
			       shininess: 80 ,
			       transparent: true,
			       opacity: 0.7,
			       overdraw: true
			    }),
			       new THREE.MeshPhongMaterial({
			       // light
			       specular: '#b03b2e',
			       // intermediate
			       color: '#a31a0b',
			       // dark
			       emissive: '#FFFFFF',
			       shininess: 80 ,
			       transparent: true,
			       opacity: 0.7,
			       overdraw: true
		  		})
	       		];

		        group = new THREE.Object3D();

		        for ( var i = 0; i < geometries.length; i ++ ) {
		           var mesh = new THREE.Mesh( geometries[i], materials[Math.floor(Math.random() * materials.length)] );
		           mesh.position.x = Math.random() * 2000 - 1000;
		           mesh.position.y = Math.random() * 2000 - 1000;
		           mesh.position.z = Math.random() * 2000 - 1000;
		           mesh.rotation.x = Math.random() * 2 * Math.PI;
		           mesh.rotation.y = Math.random() * 2 * Math.PI;
		           mesh.opacity = 50;
		           mesh.matrixAutoUpdate = false;
		           mesh.updateMatrix();
		           group.add( mesh );
		       	}


		       	renderer = new THREE.WebGLRenderer();
		      	renderer.setSize( window.innerWidth, window.innerHeight );
		       	renderer.sortObjects = false;
		       	renderer.setClearColor( '#f7f7f7', 1);
		       	container.appendChild( renderer.domElement );

		       	setTimeout(function() {
			        scene.add( group );

		       	}, 2700)

		       	window.addEventListener( 'resize', onWindowResize, false );
			}

			function onWindowResize() {
                windowHalfX = window.innerWidth / 4;
                windowHalfY = window.innerHeight / 4;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );
            }

            function onDocumentMouseMove(event) {

                mouseX = ( event.clientX - windowHalfX ) * 2;
                mouseY = ( event.clientY - windowHalfY ) * 2;
            }

            //

            function animate() {

                requestAnimationFrame( animate );
                render();

            }

            function render() {
               camera.position.x += ( mouseX - camera.position.x ) * .0080;
                camera.position.y += ( - mouseY - camera.position.y ) * .0080;

                camera.lookAt( scene.position );

                var currentSeconds = Date.now();
                group.rotation.x = Math.sin( currentSeconds * 0.0007 ) * 0.5;
                group.rotation.y = Math.sin( currentSeconds * 0.0003 ) * 0.5;
                group.rotation.z = Math.sin( currentSeconds * 0.0002 ) * 0.5;

                renderer.render( scene, camera );
            } 

		} 
	}
})

// checks initial window size to determine sizing. This directive also resizes when window is resized
.directive('resize', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			$(document).ready(function() {  
				var height = $(window).height();
				var width = $(window).width();
				element.css('height', height + 'px');
			})

			$(window).resize(function() {
				var height = $(window).height();
				var width = $(window).width();
				element.css('height', height + 'px');

				$(window).scrollTop($(window).height());
			})
		}
	}
})

.directive('animNav', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			$(function() {
				$(window).scrollTop(0);
			})

			$('.swipe').on('click', function(event) {
				$('.mobile-navbar').toggleClass('mobile-navbar-view');
				$('.swipe').toggleClass('swipe-view');
				$('.mobile-links').css('opacity', 1);
			});
			
			var list = $('.navlink');
			var time = 500;
			for (var i =0; i <list.length; i++) {
				$.each(list, function() {
					var elem = this;
					setTimeout(function() {
						$(elem).removeClass('notViewed');
						$(elem).addClass('view');
					}, time += 250);
				})
			}
			
			var lastScrollTop = 0;
			setInterval(function() {
				var now = new Date().getTime();
				lastScrollTop = $(window).scrollTop();
			}, 1500);

			$(window).on('scroll', function(event){
				var st = $(this).scrollTop();
				if (st == 0) {
					$('.navbar').css('opacity', 1);
	  				$('.navlink').addClass('view');
				}
				else if (st > lastScrollTop){
   				// downscroll code
	   				$('.navbar').css('opacity', 0);
	   				$('.navlink').removeClass('view');
	   				$('.mobile-navbar').removeClass('mobile-navbar-view');
	   				$('.swipe').removeClass('swipe-view');
				} else {
  				// upscroll code
	  				$('.navbar').css('opacity', 1);
	  				$('.navlink').addClass('view');
			   }
			   // lastScrollTop = st;
			});
		}
	}
})
.directive('sizeResume', function() {
	return{
		restrict: 'A',
		link: function(scope, element, attributes) {
			$(document).ready(function() {
				var height = $(window).height();
				$('#frame').css('height', height * 0.9 + 'px');
				$('#frame').css('width', 100 + '%');
				$('#frame').css('margin-top', height * 0.05 + 'px');
				$('#frame').css('margin-bottom', height * 0.05 + 'px');
				$('#frame').css('display', 'inline');
			})
		}
	}
})

// directive for displaying instagram photos onto /instagram
.directive('instagram', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {

				var watch = scope.$watch('photos.length', function(newVal, oldVal) {
				if (newVal == 20 ) {
					// loadInstagrams(start, stop);
					loadPhotos(scope.photos);
				}
			});
			
			function loadPhotos(photos) {
				var container = angular.element("<div></div>");
				container.addClass("row-fluid");

				for (var i = 0; i < photos.length; i++) {
					var newPhoto = photos[i];
					var newPhotoElement = angular.element("<div></div>");
					var newPhotoElementATag = angular.element("<a></a>");
			        newPhotoImage = angular.element("<img>");

					var caption = newPhoto.caption != null ? newPhoto.caption.text : ""
					var link = $(window).width() > 480 ? newPhoto.images.standard_resolution.url : newPhoto.images.low_resolution.url;
					var newPhotoClass = $(window).width() > 767 ? "instagram-image" : "instagram-medium"

			        newPhotoImage
			        	.addClass(newPhotoClass)
		                .attr('src', link);
					newPhotoElementATag
						.attr('target', '_blank')
			            .attr('href', link)
			            .attr('title', caption)
			            .append(newPhotoImage);
					newPhotoElement
						.addClass('col-lg-5ths')
				        .addClass('col-md-5ths')
				        .addClass('col-xs-5ths')
			        	.attr('id', newPhoto.id)
			        	.append(newPhotoElementATag);

			        container.append(newPhotoElement);
			    }
			    $("#instagram").append(container);
			}
		}
	}
})

.directive('geoPhotos', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			if ($(window).width() > 767) {
				$('.angular-google-map-container').css('height', '500px')
				$('.search').css('width', '50%');
			  	photoclass = "instagram-image";
			  } else photoclass = "instagram-medium"

			function createGeoPhoto(photo) {
				return $('<div class>')
				.addClass('col-lg-5ths')
	        	.addClass('col-md-5ths')
	        	.addClass('col-xs-5ths')
	        	.append(
	          $('<a>')
	            .attr('target', '_blank')
	            .attr('href', photo.link)
	            .append(
	              $('<img>')
	                .addClass(photoclass)
	                .attr('src', photo.images.standard_resolution.url)
	            )
	        	);
			}
			scope.$watch('geoPhotos', function callback(newVal, oldVal) {
				if (newVal) {
					$('#geophotos').empty();
					for (var i = 0; i < newVal.length; i++) {
						$('#geophotos').append(createGeoPhoto(scope.geoPhotos[i]))
					}
					$('#geophotos').append('<div style="clear: both">');
				}
			})
			scope.$watch('geoPhotos.length', function callback(newVal, oldVal) {
				if (newVal) {
					$('#geophotos').empty();
					for (var i = 0; i < newVal; i++) {
						$('#geophotos').append(createGeoPhoto(scope.geoPhotos[i]))
					}
					$('#geophotos').append('<div style="clear: both">');
				}
			})
		}
}})

.directive('blogAnimator', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			if ($('html').width() < 768) {
				$("h1").css('font-size', 38 + 'px');
			}

			setTimeout(function() {
				$('.blog').removeClass('notViewed');
				$('.blog').addClass('viewed');
			}, 2900);
		}
	}
})

.directive('customOnChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attributes) {
			var onChangeHandler = scope.$eval(attributes.customOnChange);
			element.bind('change', onChangeHandler);
		}
	};
})

.directive('dynamicTextArea', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attributes) {
			element.on('keyup', function() {
				autoExpand();
			})

			function autoExpand () {
    			var scrollHeight = $(element).prop("scrollHeight") - 60;
        		element.css('height', scrollHeight + "px");    
    		};

		}
	}
})

;