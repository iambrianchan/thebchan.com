 // app/routes.js
var Users = require('./models/user');
var Blog = require('./models/blog');
var passport	   = require('passport');
var LocalStrategy  = require('passport-local');
var request = require('request');
var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var access_token;


// import environment configuration
var config = require('./../env.json').production;

// create redis client
var options = {
  host: config.REDIS_SERVER,
  port: config.REDIS_PORT,
  password: config.REDIS_PASS
};
var client = redis.createClient(options);

// Passport session setup
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {

    Users.findOne({
      username: username,
      password: password
    }, function callback(error, user) {
      if (error) {
        return done(error);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      return done(null, user);
    });
  }
));

// Ensure authentication for admin routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  else res.redirect('/login');
}

// gets all blog entries
function getEntries(res) {
	Blog.find(function(err, blogs) {
		if(err) 
			res.send(err)
		res.json(blogs);
	});
};


module.exports = function(app) {
  // create redis store
  var options = {
    client: client,
    pass: config.REDIS_PASS,
    host: config.REDIS_SERVER,
    port: config.REDIS_PORT
  }
  var sessionStore = new RedisStore(options);

  // use passport with redis store
  app.use(session({
    secret: 'doing portfolio things',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { 'maxAge': 1800000 },
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // api routes
  app.get('/admin', ensureAuthenticated, function callback(req, res) {
    res.render('index');
  });

	app.get('/api/blogs', function(req, res) {
		getEntries(res);
	});

	app.post('/api/blogs', function(req, res) {
    var blogpost = req.body;

		Blog.create({
			title: blogpost.title,
      intro: blogpost.intro,
      content: blogpost.content,
      url: blogpost.title.split(' ').join('-'),
      date: blogpost.date
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

	app.post('/login', passport.authenticate('local'),
	function(req, res) {
		res.redirect('/admin');
	});

  // serve up index.pug
  app.get('*', function(req, res) {
      res.render('index');
  });
}