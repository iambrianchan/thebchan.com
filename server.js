// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose	   = require('mongoose');
var passport	   = require('passport');
var LocalStrategy  = require('passport-local');
var Instagram      = require('instagram-node-lib');
var session        = require('express-session');


// configuration ===========================================
var db = require('./config/db');

// Configure Instagram NodeJS library

Instagram.set('client_id', 'be9a87d452de4b7cb154f6cc259280ad');
Instagram.set('client_secret', 'b4c402017a03419ba841274d43472c7d');
Instagram.set('access_token', '14672124.be9a87d.7a7916688466452dbd9e5b97e354ac87');


// set the port
var port = process.env.PORT || 4000; 

// connect to the db
mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.get('/api/feed/:userid', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	Instagram.users.recent({
		user_id: req.params.userid,
		max_id: req.query["max_id"],
		count: 25,
		complete: function(data, pagination) {
			chunk = { 'data': data, 'pagination': pagination};
			res.send(chunk);
		}
	})
});

app.get('/api/map', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	Instagram.users.recent({
		user_id: 14672124,
		max_id: req.query["max_id"],
		count: 25,
		complete: function(data, pagination) {
			chunk = { 'data': data, 'pagination': pagination};
			res.send(chunk);
		}
	})
});

app.set('views', __dirname + '/public/src/views');
app.set('view engine', 'pug');

// app.use(express.logger('dev'));
app.use(bodyParser.json()); 

// passport
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/')); 

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
app.listen(port);               

// shoutout to know its running                     
console.log('listening on port ' + port);

// expose app           
exports = module.exports = app;                         
