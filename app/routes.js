 // app/routes.js

var Blog = require('./models/blog');
var passport	   = require('passport');
var LocalStrategy  = require('passport-local');
var request = require('request');
var access_token;

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

function getAccessToken(callback) {
    var url = "https://api.twitter.com/oauth2/token";
    var key = "9KtbFMUmTnAUHqf7QbACQXZWH";
    var secret = "TTdcNeAkuEXoo8wli7mjspVOfN5VWVCqajWlFrpmnG7r2WlWnI";
    var keyandsecret = key + ":" + secret;
    keyandsecret = new Buffer(keyandsecret).toString('base64');
    var headers = {
      Authorization: "Basic " + keyandsecret,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
    var options = {
      method: "POST",
      url: url,
      headers: headers,
      form: "grant_type=client_credentials"
    }
    request(options, function onDone(error, response, body) {
      if (error) {
        console.log(error);
      }
      if (!error && response.statusCode == 200) {
        callback(body);
      }
  })
}
function getTweets(access_token, res) {
  var url = "https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=266820959";
  var options = {
    method: "GET",
    url: url,
    headers: {
      "Authorization": "Bearer " + access_token
    }
  }
  request(options, function retrieveTweets(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(body);
    }
    else {
      res.json(error);
    }
  })
}

module.exports = function(app) {

  app.get('/api/twitter', function callback(req, res) {
    if (!access_token) {
      getAccessToken(function useAccessToken(body) {
        body = JSON.parse(body);
        access_token = body.access_token;
        if (body.token_type == "bearer") {
          getTweets(access_token, res);
        }
      })
    }
    else {
      getTweets(access_token, res);
    }
  })
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