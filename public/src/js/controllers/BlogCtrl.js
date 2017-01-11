// Controller for Blog page.
angular.module('BlogCtrl', []).controller('BlogController', ['$scope', '$http', '$location', '$sce', 'Blog', function($scope, $http, $location, $sce, Blog) {

	$scope.currentPage = 1;
	$scope.numPerPage = 4;
	$scope.maxSize = 5;
	$scope.view = "create";
	$scope.selected = {};

	// sort blog posts by creation date	
	function sortByDate(a, b) {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	}
	
	// get all blog posts
	function getBlogs() {
		Blog.get()
			.success(function(data) {
				$scope.blogs = data.sort(sortByDate);
				var currentBlog = function() {
					var blogTitle = $location.path().match(/[^\/]+$/)[0];
					for (var i = 0; i < $scope.blogs.length; i++) {
						if ($scope.blogs[i].url == blogTitle) {
							$scope.article = $scope.blogs[i];
						};
					};
				}();
				$scope.selected = {};
				$scope.filteredBlogs = $scope.blogs;
				// $scope.filteredBlogs = $scope.blogs.slice(0,4);
			});
	}

	getBlogs();

// do not use until angular ui is working
// 	setTimeout(function() {
// 	$scope.$watch("currentPage + numPerPage", function() {
// 	  	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
// 	  	, end = begin + $scope.numPerPage;

// 	  	$scope.filteredBlogs = $scope.blogs.slice(begin, end);
// 	});	
// }, 1000);

	// change the view
	$scope.changeView = function(type) {

		$scope.view = type;

		return;
	}

	$scope.selectBlog = function(blog) {

		return $scope.selected = blog;

	}

	$scope.createBlog = function() {

		if ($scope.newBlogData.content.length > 0 && $scope.newBlogData.title != "title" && $scope.newBlogData.intro != "intro") {

			Blog.create($scope.newBlogData)
				.success(function callback(data) {
					$scope.newBlogData = {
						title: "title",
						date: new Date(),
						content: []
					};

					return 	getBlogs();
				})
		}
	}

	$scope.deleteBlog = function() {

		Blog.delete($scope.selected._id)
			.then(function onSuccess() {

				getBlogs();

				return window.alert("Successfully removed blog post.");

			}, function onError(error) {

				return window.alert("An error occurred while removing blog post.");

			})
	}


	$scope.uploadFile = function(event) {
		var itemName = this.parentNode.parentNode.id;

		var file = event.target.files[0];
		r = new FileReader();
		r.onloadend = function(e) {

			var data = e.target.result;
			$scope.newBlogData.content[itemName].src = data;
			$scope.$digest();

		}

		r.readAsDataURL(file);
	};

	$scope.newBlogData = {

		title: "title",
		intro: "intro",
		date: new Date(),
		content: []

	};

	$scope.add = function(type) {

		if (type == "text") {

			var newTextItem = {
				index: $scope.newBlogData.content.length,
				type: "text",
				text: ""
			}

			$scope.newBlogData.content.push(newTextItem);
		}

		else if (type == "image") {

			var newImageItem = {
				index: $scope.newBlogData.content.length,
				type: "image",
				src: ""
			}

			$scope.newBlogData.content.push(newImageItem);
		}

		else if (type == "iframe") {

			var newIframeItem = {
				index: $scope.newBlogData.content.length,
				type: "iframe",
				src: ""
			}

			$scope.newBlogData.content.push(newIframeItem);
		}

		return;
	};
	$scope.remove = function(index) {

		for (var i = 0; i < $scope.newBlogData.content.length; i++) {
			if ($scope.newBlogData.content[i].index == index) {
				$scope.newBlogData.content.splice(i, 1);
			}
		}

		return;
	};

  	$scope.trustSrc = function(src) {
    	return $sce.trustAsResourceUrl(src);
  	};
}]);