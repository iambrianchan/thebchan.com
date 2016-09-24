// Controller for Blog page.
angular.module('BlogCtrl', []).controller('BlogController', ['$scope', '$http', '$location', 'Blog', function($scope, $http, $location, Blog) {
	
	function sortByDate(a, b) {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	}

	function parseBlogData(blogData) {
		var arrayOfBlogs = [];

		var blogs = function(blogs) {
    		function parseImages(images) {
		      	for (var i = 0; i < images.length; i++) {
		        	images[i] = "<p><img src=src/img/" + images[i] + "></p>";
		      	}
		      	return images;
		    }

			function parseBlog(blog) {
				var body, images, counter;
				body = blog.body.split("\\n\\n");
				images = parseImages(blog.images);
				counter = 0;

				for (var i = 0; i < body.length; i++) {
					if (body[i] == "**image**") {
						body[i] = images[counter];
						counter++;
					}
					else {
          				body[i] = "<p>" + body[i] + "</p>";
					}
				};

				blog.body = body.join("");
				return blog;
			}

			function parseBlogs(blogs) {
				for (var i = 0; i < blogs.length; i++) {
					arrayOfBlogs.push(parseBlog(blogs[i]));
				};

				return arrayOfBlogs;
			}

			return {
				getAllBlogs : parseBlogs
			};
		}(blogData);

		return blogs.getAllBlogs(blogData);		
	}
	
	Blog.get()
		.success(function(data) {

			var blogs = parseBlogData(data).sort(sortByDate);
			$scope.blogs = blogs;

			var currentBlog = function() {
				var blogTitle = $location.path().match(/[^\/]+$/)[0];
				for (var i = 0; i < $scope.blogs.length; i++) {
					if ($scope.blogs[i].url == blogTitle) {
						$scope.article = $scope.blogs[i];
						console.log($scope.article);
					};
				};
			}();

			$scope.filteredBlogs = $scope.blogs.slice(0,4);
		});

	$scope.currentPage = 1;
	$scope.numPerPage = 4;
	$scope.maxSize = 5;

	setTimeout(function() {
	$scope.$watch("currentPage + numPerPage", function() {
	  	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
	  	, end = begin + $scope.numPerPage;

	  	$scope.filteredBlogs = $scope.blogs.slice(begin, end);
	});	
}, 1000);

	$scope.createBlog = function() {
		if ($scope.formData.body != undefined && $scope.formData.title != undefined) {
			Blog.create($scope.formData)
				.success(function(data) {
					$scope.formData = {};
				});
		}
	}

	$scope.deleteBlog = function() {
		Blog.delete($scope.article._id)
			.success(function() {
		  	});
	}
}]);