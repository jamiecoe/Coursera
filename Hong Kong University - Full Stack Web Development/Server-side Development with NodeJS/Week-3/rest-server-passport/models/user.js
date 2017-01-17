// User Model

var mongoose = require('mongoose');
// Create mongoose schema
var Schema = mongoose.Schema;
// Mongoose support plugin for models
// Provides alot of additonal methods 
var passportLocalMongoose = require('passport-local-mongoose');

// User schema
// passportLocalMongoose automatically assumes username & password are going to available parts of schema. Even if you don't declare them, passportLocalMongoose will automatically insert them
// admin is intially set to false so when a new user is created they don't have access to all features (we can give these later)
var User = new Schema({
    username: String,
    password: String,
    admin:   {
        type: Boolean,
        default: false
    }
});

// Attach passportLocalMongoose as a plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);