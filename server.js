console.log("Server JavaScript start.");
var fs = require('fs');
var path = require('path');
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    //BSON = require('mongodb').pure().BSON, //this was requred in the docs for making objectID's with MongoDB, but it will not compile
    assert = require('assert');
var handlebars = require('handlebars');
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3177;

var stashData = require('./stashData');
var postData = require('./postData');
var commentData = require('./commentData');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//environment variables for MongoDB
var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB;
var mongoDBDocumentName = process.env.MONGO_DOCUMENT || "stashes";

var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoConnection = null;



//////////////////////////////////////
////*Express Middleware Functions*////
//////////////////////////////////////

app.use(bodyParser.json());

// We have gotten a request to add a comment. Respond.
app.post("/stash/:stashId/:postId/addComment", function (req, res, next) {

  var stashCollection = mongoConnection.collection('stashes');

	var postObj = {
		user: req.body.user,
		text: req.body.text,
		commentId: 0
	};

	var objectId = new ObjectID(req.params.postId);

  stashCollection.updateOne(
		{ topic: req.params.stashId, "posts.postId": objectId },
		{ $push: { "posts.$.comments": postObj } },
		function (err, result) {
      if (err) {
        res.status(500).send("Error fetching stashes from DB");
      } else {
        res.status(200).send("Success");
      }
    });
});

// We have gotten a request to add a post. Respond.
app.post("/stash/:stashId/addPost", function (req, res, next) {

	var stashCollection = mongoConnection.collection('stashes');

	// Create a new ObjectID
	var objectId = new ObjectID();
	// Verify that the hex string is 24 characters long
	assert.equal(24, objectId.toHexString().length);

	var postObj = {
		postId: objectId,
		topic: req.params.stashId,
		user: req.body.user,
		imageURL: req.body.imageURL,
		title: req.body.title,
		comments: []
	};

  stashCollection.updateOne(
  	{ topic: req.params.stashId },
    { $push: { posts: postObj } },
    function (err, result) {
      if (err) {
        res.status(500).send("Error fetching stashes from DB");
      } else {
				var newSendString = String(objectId);
        res.status(200).send(newSendString);
      }
    });
});

// We have gotten a request to add a stash. Respond.
app.post('/addStash', function (req, res, next) {

	var stashCollection = mongoConnection.collection('stashes');

	stashCollection.insert({
		 topic: req.body.topic,
		 text: req.body.text,
		 posts: [ ]
	});

	// Responding with status code 200.
	res.status(200).send("Success");

});

//a catch all for any http DELETE requests.  WE DO NOT ALLOW ANY DELETE REQUEST
app.delete('*', function (req, res, next) {
	res.status(405).send("DELETE is not allowed.");//note that status code 405 = Method not alowed
});


app.use(express.static('public'));

app.get('/', function (req, res, next) {
	req.url = '/stash';//if url is home directory change it to /stash so next middleware function can catch it
	next();
});

//we have recieved a request for the stash main page
app.get('/stash', function (req, res, next) {
	var stashCollection = mongoConnection.collection('stashes');
	stashCollection.find().sort({topic: 1}).toArray(function (err, results) {
		if (err) {
			res.status(500).send("Error fetching stash from DB");
		} else {
			for(var i = 0; i < results.length; i++){
				results[i].linkURL = "/stash/" + results[i].topic;
			}
			res.status(200).render('stashPage', {stashes: results});
		}
	});
});

//we have recieved a request for a post page
app.get('/stash/:stashName', function (req, res, next) {
	var stashName = req.params.stashName;
	var stashCollection = mongoConnection.collection('stashes');
	stashCollection.find({topic: stashName}).toArray(function (err, results) {
		if (err) {
			res.status(500).send("Error fetching stash from DB");
		} else if (results.length === 0){
			next();//the stash is not in the DB
		}
		else{
			for(var i = 0; i < results[0].posts.length; i++){
				results[0].posts[i].linkURL = "/stash/" + stashName + "/" + results[0].posts[i].postId;
			}
			res.status(200).render('postPage', results[0]);
		}
	});
});

//we have recieved a request for a comment page
app.get('/stash/:stashName/:postId', function (req, res, next) {
 	var stashName = req.params.stashName;
 	var postId = req.params.postId;
 	var stashCollection = mongoConnection.collection('stashes');
	stashCollection.find({topic: stashName}).toArray(function (err, results) {
		if (err) {
			res.status(500).send("Error fetching stash from DB");
		} else if (results.length === 0){
			next();//the stash is not in the DB
		}
		else{
			var postFound = false;
			for(var i = 0; i < results[0].posts.length; i++){
				if(results[0].posts[i].postId.toString() === postId ){
					postFound = true;
					results[0].posts[i].linkURL = "/stash/" + stashName + "/" + results[0].posts[i].postId;
					res.status(200).render('commentPage', {posts: [results[0].posts[i]], comments: results[0].posts[i].comments});
				}
			}
			if(!postFound){
				next();
			}
		}
	});
});

//catch any http get method with a path that can not be resolved above
app.get('*', function (req, res, next) {
	res.status(404).render('404Page');
});


//////////////////////////////////////////////
////*Connect to Database and start Server*////
//////////////////////////////////////////////
console.log("---MongoDB URL = ", mongoURL);
MongoClient.connect(mongoURL, function (err, connection) {
  if (err) {
    throw err;
  }
  console.log("---Server is connected to the MongoDB database");
  mongoConnection = connection;

  //start server
  app.listen(port, function () {
    console.log("---Server is listening on port ", port);
  });
});
