// Mongoose population example

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Favorites = require('../models/favorites');
var Verify = require('./verify');
// Use express router object, which is bit like a mini express application
var favoriteRouter = express.Router();
// Parse incoming request bodies in a middleware before your handlers, only parses JSON
favoriteRouter.use(bodyParser.json());
// Only have to specify url once (less error prone), then attach all request types 
// Only use '/' for the time being 
favoriteRouter.route('/')
    // Chained to favoriteRouter.route(), no semi-colon after previous function
    // When we receive a GET request on '/' (we're requesting something) 
    // Pass in Verify.verifyOrdinaryUser as first parameter this means the Verify middleware is applied before the callback function 
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        // Searches for all the documents ({}) in the 'favorites' collection
        // Populate postedBy and dishes field (ie: User info and favorite dishes)
        // returns as an array called 'favorites' in the exec function      
        Favorites.find({}).populate('postedBy').populate('dishes').exec(function (err, favorites) {
            // Error check
            if (err) throw err;
            // Convert favorites array into a JSON string and put it into Response to send back to client
            // Don't need to set header, when you call this method - status code automatically set to 200 and content type set to application/json 
            res.json(favorites);
        });
    })
    // When we receive a POST request on '/' (we're adding something new) 
    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        // Create a new document inside 'favorites' collection
        // Use req.body as the new document in Mongo DB server
        // Callback function returns new document as 'favorites' parameter, but now has '_id' property etc
        Favorites.create(req.body, function (err, favorites) {
            if (err) throw err;
            console.log('Favorite created!');
            var id = favorites._id;
            // Write response head
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            // Return response with message / dish ID
            res.end('Added favorite with id: ' + id);
        });
    });
//    // Delete all dishes
//    // verifyOrdinaryUser must come before verfiyAdmin, as we need access to first assign token - then use it to check user's admin privilages via req.decoded
//    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
//        // Find all dishes with {} and remove them
//        // resp is a javascript object which indicates how many dishes have been deleted
//        Dishes.remove({}, function (err, resp) {
//            if (err) throw err;
//            res.json(resp); // Send info back to the client as JSON
//        });
//    }); // semi-colon now completes function chain
//// define new route, with dishId
//dishRouter.route('/:dishId')
//    // Chain functions
//    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
//        // Find specific dish
//        // Populate postedBy field (ie: User info) into comments
//        // You have access to supplied dishID with req.params.dishId
//        Dishes.findById(req.params.dishId).populate('comments.postedBy').exec(function (err, dish) {
//            if (err) throw err;
//            // Return found dish and send back to client as JSON
//            res.json(dish);
//        });
//    })
//    // Update a pre-exsisting dish
//    // verifyOrdinaryUser must come before verfiyAdmin, as we need access to first assign token - then use it to check user's admin privilages via req.decoded
//    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
//        // Find a dish by its ID
//        // Second param specifies we want to update this dish with req.body (which should contain the updaets in JSON format)
//        // Third states we want to be returned with the UPDATED dish
//        // Fourth is callback which sends updated dish back to client as JSON
//        Dishes.findByIdAndUpdate(req.params.dishId, {
//            $set: req.body
//        }, {
//            new: true
//        }, function (err, dish) {
//            if (err) throw err;
//            res.json(dish);
//        });
//    })
//    // delete specific dish
//    // verifyOrdinaryUser must come before verfiyAdmin, as we need access to first assign token - then use it to check user's admin privilages via req.decoded
//    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
//        // Find dish by ID and delete it
//        // resp is a javascript object which indicates which dishes has been deleted
//        Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
//            if (err) throw err;
//            res.json(resp); // // Send info back to the client as JSON
//        });
//    }); // semi-colon now completes function chain
//// define new route, for comments on specific dishes
//dishRouter.route('/:dishId/comments')
//    .all(Verify.verifyOrdinaryUser)
//    // get all comments on a specific dish
//    .get(function (req, res, next) {
//        // Find by dishId
//        // Populate postedBy field (ie: User info) into comments
//        Dishes.findById(req.params.dishId).populate('comments.postedBy').exec(function (err, dish) {
//            if (err) throw err;
//            res.json(dish.comments); // return dish.comments as JSON to client
//        });
//    })
//    // Post a new comment
//    .post(function (req, res, next) {
//        // Find dish by dishId
//        Dishes.findById(req.params.dishId, function (err, dish) {
//            if (err) throw err;
//            // Get the userId from req.decoded._doc._id, add it to the postedBy field in request body
//            req.body.postedBy = req.decoded._doc._id;
//            // Push a new comment (contained in the req.body) to dish.comments array
//            dish.comments.push(req.body);
//            // save updated dish
//            dish.save(function (err, dish) {
//                if (err) throw err;
//                console.log('Updated Comments!');
//                res.json(dish); // return updated dish as JSON to client
//            });
//        });
//    })
//    // delete all comments on a specific dish (admin only)
//    .delete(Verify.verifyAdmin, function (req, res, next) {
//        // Find by dishId
//        Dishes.findById(req.params.dishId, function (err, dish) {
//            if (err) throw err;
//            // loop backwards through all comments
//            for (var i = (dish.comments.length - 1); i >= 0; i--) {
//                // Can't use .remove() on a whole array all at once
//                // Access each dish comment by using dish.comments[i]._id and then .remove() it
//                dish.comments.id(dish.comments[i]._id).remove();
//            }
//            // Save updated dish
//            dish.save(function (err, result) {
//                if (err) throw err;
//                // Write response header
//                res.writeHead(200, {
//                    'Content-Type': 'text/plain'
//                });
//                // Return delete confirmation message to client
//                res.end('Deleted all comments!');
//            });
//        });
//    }); // semi-colon now completes function chain
//// define new route, for SPECIFIC comments on specific dishes
//dishRouter.route('/:dishId/comments/:commentId').all(Verify.verifyOrdinaryUser)
//    // Get a specific comment 
//    .get(function (req, res, next) {
//        // Find specific dish by dishId
//        // Populate postedBy field (ie: User info) into comment
//        Dishes.findById(req.params.dishId).populate('comments.postedBy').exec(function (err, dish) {
//            if (err) throw err;
//            // Send back as JSON the specific comment using req.params.commentId
//            res.json(dish.comments.id(req.params.commentId));
//        });
//    })
//    // Update a specific comment
//    .put(function (req, res, next) {
//        // We delete the existing commment and insert the updated comment as a new comment
//        // Find dish by dishId
//        Dishes.findById(req.params.dishId, function (err, dish) {
//            if (err) throw err;
//            // Remove old comment
//            dish.comments.id(req.params.commentId).remove();
//            // Get the userId from req.decoded._doc._id, add it to the postedBy field in request body
//            req.body.postedBy = req.decoded._doc._id;
//            // Push the new comment to comments arry
//            dish.comments.push(req.body);
//            // Save updated dish
//            dish.save(function (err, dish) {
//                if (err) throw err;
//                console.log('Updated Comments!');
//                // return updated dish to client as JSON
//                res.json(dish);
//            });
//        });
//    })
//    // Delete a specific comment
//    .delete(function (req, res, next) {
//        // Find dish by dishID
//        Dishes.findById(req.params.dishId, function (err, dish) {
//            // Check that user who is deleting comment is same user that originally posted comment
//            if (dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
//                // If not then throw an error
//                var err = new Error('You are not authorized to perform this operation!');
//                err.status = 403;
//                return next(err);
//            }
//            // Othewise delete comment
//            // Find comment with commentId and remove it
//            dish.comments.id(req.params.commentId).remove();
//            // Save updated dish
//            dish.save(function (err, resp) {
//                if (err) throw err;
//                res.json(resp); // Return reponse message as JSON to client
//            });
//        });
//    }); // semi-colon now completes function chain
module.exports = favoriteRouter;