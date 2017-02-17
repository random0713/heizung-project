var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/loginapp');
var db = mongoose.connection;

//routes
var routes = require('./routes/index');
var users = require('./routes/users');

//init app
var app = express();

//view engines
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//bodyParser 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//css usw
app.use(express.static(path.join(__dirname, 'public')));

//express-session middleware
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect-flash
app.use(flash());

//global variable für flash
app.use(function(request, response, next) {
	response.locals.success_msg = request.flash('success_msg');
	response.locals.error_msg = request.flash('error_msg');
	response.locals.error = request.flash('error');
	next();
});

//Define routes
app.use('/', routes);
app.use('/users', users);

module.exports = app;