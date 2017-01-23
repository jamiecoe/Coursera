//  *** Using JSON Web Tokens and Passport ***
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
// Bring in all configuration info
var config = require('./config');
// Connect to mongoDB
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});
var routes = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var app = express();

// First middleware, will intercept all incoming traffic
// '*' means this is applied to all incoming traffic
// Secure traffic only
app.all('*', function (req, res, next) {
    // Log request info    
    console.log('req start: ', req.secure, req.hostname, req.url, app.get('port'));
    // If request is coming into the secure port to secure server    
    if (req.secure) {
        // Carry on as normal  
        return next();
    };
    // Otherwise if request was to insecure server (localhost:3000), send back a redirect to client for the secure server url  (ie: https://localhost:3443/url)
    // req.url gives us url from the first line of the HTTP request message
    res.redirect('https://' + req.hostname + ':' + app.get('secPort') + req.url);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// passport config
// Initialise passport middleware
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leadership', leaderRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // Return error as JSON rather than HTML (needed for Angular / Ionic applications)  
        res.json({
            message: err.message
            , error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // Return error as JSON rather than HTML (needed for Angular / Ionic applications) 
    res.json({
        message: err.message
        , error: {}
    });
});
module.exports = app;