var express = require('express');
var bodyParser = require('body-parser');

// Use express router object, which is bit like a mini express application
var promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// Only have to specify url once (less error prone), then attach all request types 
// Only use '/' for the time being 
promoRouter.route('/')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

// Chained to promoRouter.route(), no semi-colon after previous function
.get(function(req,res,next){
        res.end('Will send all the promos to you!');
})

.post(function(req, res, next){
    res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);    
})

.delete(function(req, res, next){
        res.end('Deleting all promos');
}); // semi-colon now completes function chain

// define new route, with promoId
promoRouter.route('/:promoId')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(function(req,res,next){
    res.end('Will send details of the promo: ' + req.params.promoId +' to you!');
})

.put(function(req, res, next){
    res.write('Updating the promo: ' + req.params.promoId + '\n');
    res.end('Will update the promo: ' + req.body.name + 
            ' with details: ' + req.body.description);
})

.delete(function(req, res, next){
        res.end('Deleting promo: ' + req.params.promoId);
}); // semi-colon now completes function chain


module.exports = promoRouter;