describe('BlogController', function() {

	beforeEach(function() {
		module('BlogCtrl');
		module('BlogService')
	});

	it('should be added to scope', inject(function($controller, $httpBackend) {
		var scope = {};
		$httpBackend
			.when('GET', '/api/blogs')
			.respond([
				'blog1', 'blog2', 'blog3', 'blog4', 'blog5'
			]);

		var BlogCtrl = $controller('BlogController', {
			$scope: scope
		});

		$httpBackend.flush();

		scope.blogs.should.contain('blog5');
		scope.filteredBlogs.should.contain('blog1');
	}));
});