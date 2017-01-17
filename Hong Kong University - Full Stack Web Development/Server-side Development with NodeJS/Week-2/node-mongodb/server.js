var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var dboper = require('./operations');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    
    // (Asynchronous Functions) Insert new document into collection > Find document > Update document > Find it again > Delete Collection & close database

    // db is database returned when you connect to MongoClient
    // Second parameter is a document you want to insert into your collection
    // Third Parameter is name of collection you want to insert document
    dboper.insertDocument(db, { name: "Vadonut", description: "Test" }, "dishes", function (result) {
            console.log(result.ops);

            dboper.findDocuments(db, "dishes", function (docs) {
                console.log(docs);
                
                // Second parameter, only have to specify name, which is used to filter through documents which match
                dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" },
                    "dishes", function (result) {
                        console.log(result.result);

                        dboper.findDocuments(db, "dishes", function (docs) {
                            console.log(docs)

                            db.dropCollection("dishes", function (result) {
                                console.log(result);

                                db.close();
                            });
                        });
                    });
            });
        });
});