//*** Basic Authentication ***

var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// We create a new middleware called 'auth' which will do basic authentication
function auth (req, res, next) {
    // log headers
    console.log(req.headers);
    // Grab authentication info from header
    var authHeader = req.headers.authorization;
    // If they send nothing, then error
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err); // next() with error passed in will automatically raise error, and only further middleware that take/use the error will be triggered
        return;
    }

    // Take authorisation header and split it on a ' ' which returns an array of the split strings
    // Access the 2nd half of array [1] which is encoded string containing username and password
    // 'base64' parameter means we do a base64 unencoding of encoded string which gives actual value as a buffer
    // You then convert this buffer to a string and split it again at ':', diving the first array value as username and second array value as password
    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    // test values against our hardcoded user info
    if (user == 'admin' && pass == 'password') {
        next(); // authorized so move onto next middleware
    } else {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
    }
}

// To use auth middleware, we pass it in to app.use()
// Remember express applies the middleware to incoming requests in the order at which you specified the middleware
// So we do authentication before serving up public folder
app.use(auth);

app.use(express.static(__dirname + '/public'));

// Error handle middleware
// Any errors found in authentication will cause a jump to this middleware, thanks to next(err) which will pass error in
app.use(function(err,req,res,next) {
    // Construct error reply message
    // err.status || 500 = if err.status has been set then use that, otherwise its a 500 error status
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic', // Remind client you need them to do Basic authentication
        'Content-Type': 'text/plain'
    });
    // Return error message in body of response    
    res.end(err.message);
});


app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});