angular.module('BlogService', []).factory('Blog', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/api/blogs');
		},

		create : function(blogData) {
			return $http.post('api/blogs', blogData);
		},

		delete : function(id) {
			return $http.delete('/api/blogs/' + id);
		}
	}
}]);