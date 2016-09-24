describe('BlogController', function() {

	beforeEach(function() {
		module('BlogCtrl');
		module('BlogService')
	});

	it('should be added to scope', inject(function($controller, $httpBackend) {
		var scope = {};
		var blogs = ['blog1', 'blog2', 'blog3', 'blog4', 'blog5'];
		
		$httpBackend
			.when('GET', '/api/blogs')
			.respond(blogs);

		var BlogCtrl = $controller('BlogController', {
			$scope: scope
		});

		$httpBackend.flush();

		scope.blogs.should.contain('blog5');
		scope.filteredBlogs.should.contain('blog1');
	}));
});