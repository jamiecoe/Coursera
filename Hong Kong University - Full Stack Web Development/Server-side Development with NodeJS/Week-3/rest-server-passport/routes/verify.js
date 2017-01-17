// ***This module exports methods for suppling a JSON web token, and validating exisiting tokens in client requests***

var User = require('../models/user');
// jwt used to create, sign, and verify tokens
var jwt = require('jsonwebtoken'); 
// Remember config contains secret key
var config = require('../config.js');

// Function to create a token, takes in user as parameter
exports.getToken = function (user) {
    // Returns a signed webtoken for the user, with our secret key
    // This token will expire in 60mins (3600 seconds) - third parameter
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

// Function to check token from incoming user request
exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token, checks its valid
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            // Error handler
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                // Decode token and load onto req.decoded
                // Contents of token (eg: username) will be available on req.decoded
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
