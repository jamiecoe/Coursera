/* Handles all the authentication setup */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// use model user.js to track users and store / manipulate in DB
var User = require('./models/user');
var config = require('./config');
var FacebookStrategy = require('passport-facebook').Strategy;

// Passport will use new local stratergy, given by User.authenticate()
// User.authenticate() is a strategy that is exported by user.js model in which you use passport-local-mongoose plugin which supports these methods (eg: authenicate(), serializeUser(), deserializeUser())
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Set up facebook strategy for user authentication
// Supply client ID / client secret / callback url, from config module
exports.facebook = passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
  },
  // Callback for when Facebook first repond to your request, should give you an access token, refresh token and the facebook profile. 'done' is a callback function which needs to be supplied                                                  
  function(accessToken, refreshToken, profile, done) {
    // Search for user in our database using returned profile.id
    User.findOne({ OauthId: profile.id }, function(err, user) {
      if(err) {
        console.log(err); // handle errors!
      }
      // If no error and user already exists in our database        
      if (!err && user !== null) {
        // Callback with no error and user as 2nd parameter (this will be used later by passport.authenticate())  
        done(null, user);
      }
      // Otherwise create a new user    
      else {
        // username is same as facebook profile name
        user = new User({
          username: profile.displayName
        });
        // Set OAuth ID and token  
        user.OauthId = profile.id;
        user.OauthToken = accessToken;
        // Save user  
        user.save(function(err) {
          if(err) {
            console.log(err); // handle errors!
          } else {
            console.log("saving user ...");
            // Callback with no error and user as 2nd parameter (this will be used later by passport.authenticate())  
            done(null, user);
          }
        });
      }
    });
  }
));