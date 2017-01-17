var express = require('express');
var bodyParser = require('body-parser');

// Use express router object, which is bit like a mini express application
var dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// Only have to specify url once (less error prone), then attach all request types 
// Only use '/' for the time being 
dishRouter.route('/')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

// Chained to dishRouter.route(), no semi-colon after previous function
.get(function(req,res,next){
        res.end('Will send all the dishes to you!');
})

.post(function(req, res, next){
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);    
})

.delete(function(req, res, next){
        res.end('Deleting all dishes');
}); // semi-colon now completes function chain

// define new route, with dishId
dishRouter.route('/:dishId')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(function(req,res,next){
        res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})

.put(function(req, res, next){
        res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + 
            ' with details: ' + req.body.description);
})

.delete(function(req, res, next){
        res.end('Deleting dish: ' + req.params.dishId);
}); // semi-colon now completes function chain


module.exports = dishRouter;