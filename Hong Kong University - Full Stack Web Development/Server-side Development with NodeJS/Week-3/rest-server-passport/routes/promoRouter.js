var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Promotions = require('../models/promotions');
var Verify = require('./verify');

// Use express router object, which is bit like a mini express application
var promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// Only have to specify url once (less error prone), then attach all request types 
// Only use '/' for the time being 
promoRouter.route('/')
// Chained to promoRouter.route(), no semi-colon after previous function
// When we receive a GET request on '/' (we're requesting something) 
// Pass in Verify.verifyOrdinaryUser as first parameter this means the Verify middleware is applied before the callback function 
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    // Searches for all the documents ({}) in the 'promotions' collection, returned as an array called 'promotion' in the callback function      
    Promotions.find({}, function (err, promotion) {
        // Error check
        if (err) throw err;
        // Convert promotion array into a JSON string and put it into Response to send back to client
        // Don't need to set header, when you call this method - status code automatically set to 200 and content type set to application/json 
        res.json(promotion);
    });
})

// When we receive a POST request on '/' (we're adding something new) 
// verifyOrdinaryUser must come before verfiyAdmin, as we need access to first assign token - then use it to check user's admin privilages via req.decoded
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    // Create a new document inside 'promotions' collection
    // Use req.body as the new document in Mongo DB server
    // Callback function returns new document as 'promotion' parameter, but now has '_id' property etc
    Promotions.create(req.body, function (err, promotion) {
        if (err) throw err;
        
        console.log('Promotion created!');
        var id = promotion._id;
        // Write response head
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        // Return response with message / promotion ID
        res.end('Added the promotion with id: ' + id);
    });
})

// Delete all promotions (only Admin)
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    // Find all promotions with {} and remove them
    // resp is a javascript object which indicates how many promotions have been deleted
    Promotions.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp); // Send info back to the client as JSON
    });
}); // semi-colon now completes function chain

// define new route, with promoId
promoRouter.route('/:promoId')
// Chain functions
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    // Find specific promotion
    // You have access to supplied promoID with req.params.promoId
    Promotions.findById(req.params.promoId, function (err, promotion) {
        if (err) throw err;
        // Return found promotion and send back to client as JSON
        res.json(promotion); 
    });
})

// Update a pre-exsisting promotion (only admin)
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    // Find a promotion by its ID
    // Second param specifies we want to update this promotion with req.body (which should contain the updaets in JSON format)
    // Third states we want to be returned with the UPDATED promotion
    // Fourth is callback which sends updated promotion back to client as JSON
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {
        new: true
    }, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

// delete specific promotion (only admin)
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    // Find promotion by ID and delete it
    // resp is a javascript object which indicates which promotion has been deleted
    Promotions.findByIdAndRemove(req.params.promoId, function (err, resp) {
        if (err) throw err;
        res.json(resp); // // Send info back to the client as JSON
    });
}); // semi-colon now completes function chain


module.exports = promoRouter;