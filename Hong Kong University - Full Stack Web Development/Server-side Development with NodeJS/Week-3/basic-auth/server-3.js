//  *** Using Express sessions ***


var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session); // This is where we will store info gathered from express session, in a local file on the server side
// Cookie now set by express session, automatically used to fetch session information and put it on incoming requests 

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// Attach session middleware
// This will automatically add a session object to incoming request object (eg: req.session)
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321', // set secret key
  saveUninitialized: true, // Forces a newly created session without any modifications to be saved to the session store
  resave: true, // Forces a session to be saved back to store even if it was not modified in the request
  store: new FileStore() // Create new filestore to put session info
}));

// Authentication middleware function
function auth (req, res, next) {
    console.log(req.headers);
    // Check for session instead of cookies
    // Check if session.user has been set
    if (!req.session.user) {
        // Expect user to log in
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
            return;
        }
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        // If user has logged in succesfully
        if (user == 'admin' && pass == 'password') {
            // Set session.user to 'admin'
            req.session.user = 'admin';
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
    else {
        // check if user is 'admin'
        if (req.session.user === 'admin') {
            // Log session info
            console.log('req.session: ',req.session);
            next(); // Move on
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }}

app.use(auth);

app.use(express.static(__dirname + '/public'));

app.use(function(err,req,res,next) {
            res.writeHead(err.status || 500, {
            'WWW-Authenticate': 'Basic',
            'Content-Type': 'text/plain'
        });
        res.end(err.message);
});

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});