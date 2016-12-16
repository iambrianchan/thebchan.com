// server.js

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose	   = require('mongoose');
var passport	   = require('passport');
var LocalStrategy  = require('passport-local');
var Instagram      = require('instagram-node-lib');
var session        = require('express-session');
var config		   = require('./env.json');


// configuration ===========================================

// Configure Instagram NodeJS library
Instagram.set('client_id', 'be9a87d452de4b7cb154f6cc259280ad');
Instagram.set('client_secret', 'b4c402017a03419ba841274d43472c7d');
Instagram.set('access_token', '14672124.be9a87d.7a7916688466452dbd9e5b97e354ac87');

var port = process.env.PORT || 4000; 
mongoose.connect(config.development.db);

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

// app.use(bodyParser.json()); 
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(methodOverride('X-HTTP-Method-Override')); 

app.use(express.static(__dirname + '/')); 

require('./app/routes')(app);

app.listen(port);               

console.log('server running on port ' + port);

exports = module.exports = app;                         
