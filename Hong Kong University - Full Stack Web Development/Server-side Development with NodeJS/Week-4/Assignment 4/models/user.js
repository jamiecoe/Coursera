// User Model 

var mongoose = require('mongoose');
// Create mongoose schema
var Schema = mongoose.Schema;
// Passport-local-mongoose module is a Mongoose support plugin for models
// It provides alot of additonal methods 
var passportLocalMongoose = require('passport-local-mongoose');

// User schema
// passportLocalMongoose automatically assumes username & password are going to available parts of schema. Even if you don't declare them, passportLocalMongoose will automatically insert them
// admin is intially set to false so when a new user is created they don't have access to all features (we can give these later)
// OAuth ID / Token is for Facebook login method
var User = new Schema({
    username: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

// Instance method which returns the user's fullname
User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

// Attach passportLocalMongoose as a plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);