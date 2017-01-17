var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leaderships = require('../models/leaderships');

// Use express router object, which is bit like a mini express application
var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// Only have to specify url once (less error prone), then attach all request types 
// Only use '/' for the time being 
leaderRouter.route('/')

// Chained to leaderRouter.route(), no semi-colon after previous function
// When we receive a GET request on '/' (we're requesting something) 
.get(function(req,res,next){
    // Searches for all the documents ({}) in the 'leaderships' collection, returned as an array called 'leadership' in the callback function      
    Leaderships.find({}, function (err, leadership) {
        // Error check
        if (err) throw err;
        // Convert leadership array into a JSON string and put it into Response to send back to client
        // Don't need to set header, when you call this method - status code automatically set to 200 and content type set to application/json 
        res.json(leadership);
    });
})

// When we receive a POST request on '/' (we're adding something new) 
.post(function(req, res, next){
    // Create a new document inside 'leaderships' collection
    // Use req.body as the new document in Mongo DB server
    // Callback function returns new document as 'leadership' parameter, but now has '_id' property etc
    Leaderships.create(req.body, function (err, leadership) {
        if (err) throw err;
        
        console.log('Leadership created!');
        var id = leadership._id;
        // Write response head
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        // Return response with message / leader ID
        res.end('Added the leadership with id: ' + id);
    });
})

// Delete all leaderships
.delete(function(req, res, next){
    // Find all leaderships with {} and remove them
    // resp is a javascript object which indicates how many leadships have been deleted
    Leaderships.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp); // Send info back to the client as JSON
    });
}); // semi-colon now completes function chain

// define new route, with leaderId
leaderRouter.route('/:leaderId')
// Chain functions
.get(function(req,res,next){
    // Find specific leadship
    // You have access to supplied leaderID with req.params.leaderId
    Leaderships.findById(req.params.leaderId, function (err, leadship) {
        if (err) throw err;
        // Return found leadship and send back to client as JSON
        res.json(leadship); 
    });
})

// Update a pre-exsisting leadship
.put(function(req, res, next){
    // Find a leadship by its ID
    // Second param specifies we want to update this leadship with req.body (which should contain the updaets in JSON format)
    // Third states we want to be returned with the UPDATED leadship
    // Fourth is callback which sends updated leadship back to client as JSON
    Leaderships.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leadship) {
        if (err) throw err;
        res.json(leadship);
    });
})

// delete specific leadship
.delete(function(req, res, next){
    // Find leadship by ID and delete it
    // resp is a javascript object which indicates which leadships has been deleted
    Leaderships.findByIdAndRemove(req.params.leaderId, function (err, resp) {
        if (err) throw err;
        res.json(resp); // // Send info back to the client as JSON
    });
}); // semi-colon now completes function chain


module.exports = leaderRouter;