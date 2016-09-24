 // app/routes.js

var Blog = require('./models/blog');
var passport	   = require('passport');
var LocalStrategy  = require('passport-local');

function parseBlogPostInput(input) {

  var post = function() {

    function parseImageInput(blog) {
      var images = blog.images.split("\n");

      return images;
    }

    function createURL(blog) {
      var url = blog.title.split(" ").join("-");

      return url;
    }

    function readyBlogPost(blog) {
      blog.images = parseImageInput(blog);
      blog.url = createURL(blog);

      return blog;
    }
    
    return {
      readyBlogPost : readyBlogPost
    }
  }();

  return post.readyBlogPost(input);
}

// local authentication via passport
var users = [
{id: 1, username: "brian", password: "Bmc2008!"}
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

// Passport session setup
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {

    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure.  Otherwise, return the authenticated user.

      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

// Ensure authentication for admin routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send('/login')
}

function getEntries(res) {
	Blog.find(function(err, blogs) {
		if(err) 
			res.send(err)
		res.json(blogs);
	});
};

    module.exports = function(app) {

    	app.get('/api/blogs', function(req, res) {
    		getEntries(res);
    	});

    	app.post('/api/blogs', function(req, res) {
        var blogpost = parseBlogPostInput(req.body);

    		Blog.create({
    			title: blogpost.title,
          intro: blogpost.intro,
    			body: blogpost.body,
          images: blogpost.images,
          url: blogpost.url,
    			date: new Date()
    		}, function(err, blog) {
    			if(err)
    				res.send(err);
    			res.json(blog);
    		});
    	});

    	app.delete('/api/blogs/:blog_id', ensureAuthenticated, function(req, res) {
    		Blog.remove({
    			_id : req.params.blog_id
    		}, function(err, blog) {
    			if(err)
    				res.send(err);
          else {
          }
    		});
    	});

    	app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}),
  		function(req, res) {
    		res.redirect('/admin');
  		});

        // server routes ==========================================================

        app.get('*', function(req, res) {
            res.render('index'); // load our public/index.html file
        });
    }