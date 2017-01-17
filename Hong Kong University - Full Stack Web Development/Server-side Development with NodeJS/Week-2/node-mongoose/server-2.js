// Different method for creating dishes, Dishes.create()

var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes-1');
// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
    // create a new dish
    Dishes.create({
        name: 'Uthapizza',
        description: 'Test'
    }, function (err, dish) {
        
        if (err) throw err;
        console.log('Dish created!');
        console.log(dish);

        var id = dish._id;

        // get all the dishes
        // setTimeout delays it's first parameter function by the second parameter (eg: 3000 milliseconds)
        // We are just doing this to create a delay between 'created' and 'updated' timestamps
        setTimeout(function () {
            Dishes.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true // by supplying this object, we are asking Dishes to return the UPDATED dish. If we didn;t supply this object, it would return the original dish
                }) 
                // Because you haven't supplied a callback function to findByIdAndUpdate(), it doesn't execute but instead returns a Query object.  
                // You therefore have to chain .exec which will execute the query with a callback function
                // The dish parameter is the updated dish
                .exec(function (err, dish) {
                    if (err) throw err;
                    console.log('Updated Dish!');
                    console.log(dish);

                    // Delete dishes collection and close DB
                    db.collection('dishes').drop(function () {
                        db.close();
                    });
                });
        }, 3000);
    });
});