// server.js

var express        = require('express');
var compression    = require('compression');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose	   = require('mongoose');
var passport	   = require('passport');
var LocalStrategy  = require('passport-local');
var session        = require('express-session');
var config         = require('./env.json');
var winston        = require('winston');

// configuration ===========================================

winston.add(
  winston.transports.File, {
    filename: 'info.log',
    level: 'info',
    json: false,
    eol: '\n', // for Windows, or `eol: ‘n’,` for *NIX OSs
    timestamp: true
  }
);

(function() {
    var exLog = console.log;
    console.log = function(msg) {
        exLog.apply(this, arguments);
        winston.info(msg);
    }
})()

var port = process.env.PORT || 4000; 
mongoose.connect(config.development.db);

app.set('views', __dirname + '/public/src/views');
app.set('view engine', 'pug');

app.use(compression());
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
