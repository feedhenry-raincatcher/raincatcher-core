var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Idea
// We can have wfm-mongo module that will implement all repositories and will include some interfaces from here.
// Providers should retrieve connection from top level application.

export class MongoProvider {
  constructor(url:string){
    var url = 'mongodb://localhost:27017/myproject';
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
    });
  }

}

