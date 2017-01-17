var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// If the body of the incoming request contains JSON data, then parse it / convert it to a javascript object
// body parser can also parse other types of data
app.use(bodyParser.json());

// For all requests containing /dishes url, perform this function
app.all('/dishes', function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next(); // Allows you to continue processing with remaining middleware functions
});

app.get('/dishes', function(req,res,next){
    // res.end('') writes any strings parameters into respose body and sends response
    res.end('Will send all the dishes to you!');
});

app.post('/dishes', function(req, res, next){
     res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

app.delete('/dishes', function(req, res, next){
    res.end('Deleting all dishes');
});

// Get a specific dish by adding /:dishId
app.get('/dishes/:dishId', function(req,res,next){
    // :dishId is made available with req.params.dishId
    res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
});

app.put('/dishes/:dishId', function(req, res, next){
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + 
            ' with details: ' + req.body.description);
});

app.delete('/dishes/:dishId', function(req, res, next){
    res.end('Deleting dish: ' + req.params.dishId);
});

// Will serve files from /public directory when requested
// Only requests to /dishes url will be handled by REST contruct above
app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});