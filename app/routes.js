 // app/routes.js
var Users = require('./models/user');
var Blog = require('./models/blog');
var passport	   = require('passport');
var LocalStrategy  = require('passport-local');
var request = require('request');
var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var Instagram = require('instagram-node-lib');
var access_token;

// Configure Instagram NodeJS library
Instagram.set('client_id', 'be9a87d452de4b7cb154f6cc259280ad');
Instagram.set('client_secret', 'b4c402017a03419ba841274d43472c7d');
Instagram.set('access_token', '14672124.be9a87d.7a7916688466452dbd9e5b97e354ac87');

// import environment configuration
var config = require('./../env.json').development;

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

			if(err) {

				res.send(err);
      }

      else {

        res.send(200);
      }

		});
	});

  app.get('/instagram', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    Instagram.users.recent({
      user_id: 14672124,
      count: 25,
      complete: function(data, pagination) {
        chunk = { 'data': data };
        res.send(chunk);
      }
    })
  });
	app.post('/login', passport.authenticate('local'), function(req, res) {

		res.redirect('/admin');

	});

  // serve up index.pug
  app.get('*', function(req, res) {

      res.render('index');
  });
}