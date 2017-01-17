var express = require('express');
var bodyParser = require('body-parser');

// Use express router object, which is bit like a mini express application
var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// Only have to specify url once (less error prone), then attach all request types 
// Only use '/' for the time being 
leaderRouter.route('/')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

// Chained to leaderRouter.route(), no semi-colon after previous function
.get(function(req,res,next){
        res.end('Will send all the leaders to you!');
})

.post(function(req, res, next){
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);    
})

.delete(function(req, res, next){
        res.end('Deleting all leaders');
}); // semi-colon now completes function chain

// define new route, with leaderId
leaderRouter.route('/:leaderId')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(function(req,res,next){
    res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})

.put(function(req, res, next){
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + 
            ' with details: ' + req.body.description);
})

.delete(function(req, res, next){
        res.end('Deleting leader: ' + req.params.leaderId);
}); // semi-colon now completes function chain


module.exports = leaderRouter;