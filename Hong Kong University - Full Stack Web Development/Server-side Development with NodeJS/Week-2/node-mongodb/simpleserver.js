var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    // check if there was an error connecting to server
    // If no errors, then err will be equal to null
    assert.equal(err, null);
    console.log("Connected correctly to server");
    // Specify the collection in the database that you want to perform operations on
    var collection = db.collection("dishes");
    // Insert a document into this collection
    collection.insertOne({name: "Uthapizza", description: "test"}, function (err, result) {
        // Check for errors
        assert.equal(err, null);
        // Prints results.ops which is an array of all the documents inserted by this insert operation
        console.log("After Insert:");
        console.log(result.ops);
        // Method that retrieves all documents in this collection and prints them out
        // Needs to be done inside collections.insertOne() callback, so that the retrival is carried out after the new document has been created
        // collection.find() takes a filter value as a parameter, so {} will return all the documents belonging to this collection
        // toArray() transforms the returned value into an array of Javascript objects, takes in a callback function 
        collection.find({}).toArray(function (err, docs) {
            // Multiple nested callback functions used because each operation must first be completed before the next one can be carried out
            
            // Check for errors and print out returned array to the screen
            assert.equal(err, null);
            console.log("Found:");
            console.log(docs);
            // Drop dishes collection from database to reset it (we are just doing this for purpose of this exercise, so we don't keep filling the db with the same document)
            db.dropCollection("dishes", function (err, result) {
                // Check for errors
                assert.equal(err, null);
                // Close connection to the database
                db.close();
            });
        });
    });
});