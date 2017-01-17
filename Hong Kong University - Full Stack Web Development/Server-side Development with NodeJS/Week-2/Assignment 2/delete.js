// Adding new comments as sub documents

var mongoose = require('mongoose'),
    assert = require('assert');

//var Promotions = require('./models/promotions');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Deleting promotions collection");

    db.collection('promotions').drop(function () {
        db.close();
    });
});