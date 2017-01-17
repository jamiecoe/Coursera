var assert = require('assert');

// Takes a database, the document to be inserted, the collection to receive new document, callback to return result of this operation
exports.insertDocument = function(db, document, collection, callback) {
  // Get the documents collection
  var coll = db.collection(collection);
  // Insert some documents
  coll.insert(document, function(err, result) {
    // Error handling  
    assert.equal(err, null);
    // Print new document to console  
    console.log("Inserted " + result.result.n + " documents into the document collection '"
                 + collection + "'");
    // callback function with result   
    callback(result);
  });
};

exports.findDocuments = function(db, collection, callback) {
  // Get the documents collection
  var coll = db.collection(collection);

  // Find some documents
  coll.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

exports.removeDocument = function(db, document, collection, callback) {

  // Get the documents collection
  var coll = db.collection(collection);

  // Delete the document
  coll.deleteOne(document, function(err, result) {
    assert.equal(err, null);
    console.log("Removed the document " + document);
    callback(result);
  });
};

exports.updateDocument = function(db, document, update, collection, callback) {

  // Get the documents collection
  var coll = db.collection(collection);

  // Update document
  // {$set: update} is used to specify which particular field within the document you want to update    
  coll.updateOne(document, { $set: update }, null, function(err, result) {

    assert.equal(err, null);
    console.log("Updated the document with " + update);
    callback(result);
  });
};