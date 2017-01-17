//  *** Using cookies for authentication ***

// We will allow server to set a cookie on the client and then expect that cookie to be returned from the client to the server with every request.
// HTTP protocol supports this


var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser'); // Will parse incoming cookies from client

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// Declare cookie parser as one of express application middleware
// This will parse incoming cookies inside client head and make them available as javascript object property
// Cookie is signed with secret key so it cannot be manually modified on client side without becoming invalid
app.use(cookieParser('12345-67890-09876-54321')); // secret key


// Authenication middleware function
function auth(req, res, next) {
    console.log(req.headers);
    
    // If client cookie doesn't exist yet, expect user to have to authenticate themselves
    if (!req.signedCookies.user) {
        // Get the authentication info from request header
        var authHeader = req.headers.authorization;
        // If there's no information (ie: null) send an error
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
            return;
        }
        // Take authorisation header and split it on a ' ' which returns an array of the split strings
        // Access the 2nd half of array [1] which is encoded string containing username and password
        // 'base64' parameter means we do a base64 unencoding of encoded string which gives actual value as a buffer
        // You then convert this buffer to a string and split it again at ':', diving the first array value as username and second array value as password
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        // If user and password are correct
        if (user == 'admin' && pass == 'password') {
            // Create a signed cookie in the response message
            // First parameter is name of cookie (eg: 'user')
            // Second parameter is value of cookie (eg: 'admin')
            // Third parameter is additional options for cookie (eg: '{signed: true}' which means it is a signed cookie using secret key we wrote earlier)
            // Client will need to send this cookie back everytime, any modifications will make signiture invalid 
            res.cookie('user', 'admin', {
                signed: true
            });
            next(); // authorized, go to next middleware
        } 
        // Otherwise, create an error
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
    // Otherwise, if client does send cookie in header of request
    else {
        // Check value of signed cookie in request message
        if (req.signedCookies.user === 'admin') {
            next();
        } 
        // Error if it's incorrect
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
};

// Use authenication middleware in express app
app.use(auth);

app.use(express.static(__dirname + '/public'));

// Error handler
app.use(function (err, req, res, next) {

    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});