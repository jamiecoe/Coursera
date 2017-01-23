// User route
// Enable users to register, login, logout
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
// verify module encapsulates everything to do with managing JSON web tokens and verfying user's identities 
var Verify = require('./verify');
// Get all users (only admin)
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    // Search for all documents in 'user' collection, returns array called 'users' in the callback function
    User.find({}, function (err, userDocuments) {
        // Error check
        if (err) throw err;
        // Convert userDocuments array into a JSON string and put it into Response to send back to client
        // Don't need to set header, when you call this method - status code automatically set to 200 and content type set to application/json 
        res.json(userDocuments);
    });
});
// if users send post to /users/register, then we register a new user
// request message should contain user register info as JSON object in the request body (bodyparser will sort this)
router.post('/register', function (req, res) {
    // To register, must must have username and password
    // User.register is additional method given by passportLocalMongoodr plugin to register a new user
    // First paramter is a new user with username, Second is the password, Third is a callback function
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, user) {
        // Handle any errors
        if (err) {
            return res.status(500).json({
                err: err
            });
        }
        // Check first name is available and add to new user
        if (req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        // Check last name is available and add to new user
        if (req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        // Save user info, and when this is done - authenicate the new user
        user.save(function (err, user) {
            // Authenicate user
            // Functions with two sets of parameters (http://stackoverflow.com/questions/18234491/two-sets-of-parentheses-after-function-call)
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration Successful!'
                });
            });
        });
    });
});
// Deals with login of exisiting user, if you send POST at /users/login with username and password in the body of the message
router.post('/login', function (req, res, next) {
    // passport.authencticate() does a 'local' authentication on user request
    passport.authenticate('local', function (err, user, info) {
            // error handler  
            if (err) {
                return next(err);
            }
            // Check if user valid
            // Anything like a wrong password or duplicate users could make user false  
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            // Log in user  
            // Passport makes available .logIn() method on req
            // Supply user as first parameter, callback is second parameter  
            req.logIn(user, function (err) {
                // Error handler 
                if (err) {
                    return res.status(500).json({
                        err: 'Could not log in user'
                    });
                }
                // If you get through logIn stage, you should be a valid user
                // Generate a specific token for that user
                var token = Verify.getToken(user);
                // Return to client in response message
                // We expect client to handle token and send it back with each new request so we can keep checking they're verified
                res.status(200).json({
                    status: 'Login successful!'
                    , success: true
                    , token: token
                });
            });
        })
        // passport.authenticate() returns a function and is given parameters (req, res, next) 
        // If authentication succeeds, the next handler will be invoked and the req.user property will be set to the authenticated user.
        // Functions with two sets of parameters (http://stackoverflow.com/questions/18234491/two-sets-of-parentheses-after-function-call)
        (req, res, next);
});
// User logging out
// A GET request to /users/logout will trigger function
router.get('/logout', function (req, res) {
    // Passport makes available .logout() method on req
    // NOT DONE IN THIS EXAMPLE but we should also destroy token given to this user
    req.logout();
    // Send message saying bye to client
    res.status(200).json({
        status: 'Bye!'
    });
});
// this is the users/facebook route, if GET requested then will call a passport.authenticate with Facebook strategy
// User will be taken to Facebook to authenticate themselves
router.get('/facebook', passport.authenticate('facebook'), function (req, res) {});
// Once Facebook has authenticated, it will redirect to our callback url - users/facebook/callback
router.get('/facebook/callback', function (req, res, next) {
    // perform passport authentication with 'facebook' strategy again
    passport.authenticate('facebook', function (err, user, info) {
        // Handle errors  
        if (err) {
            return next(err);
        }
        // If no user  
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        // Otherwise we will login user  
        req.logIn(user, function (err) {
            // Error handel    
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            // Get a token
            var token = Verify.getToken(user);
            // Return success message which includes token
            res.status(200).json({
                status: 'Login successful!'
                , success: true
                , token: token
            });
        });
    })(req, res, next);
});
module.exports = router;