console.log("Server JavaScript start.");
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
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

var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDBDatabase;



app.use(bodyParser.json());

///////////////////////////////////////////////////////////
//// DELETE THIS WHEN WE HAVE THE SERVER WORKING CORRECTLY.
///////////////////////////////////////////////////////////
app.get('/', function(req, res) {
	res.status(200).render('stashPage', {stashes: stashData});
});

app.get('/posts', function(req, res) {
	res.status(200).render('postPage', {posts: postData});
});

app.get('/comments', function(req, res) {
	res.status(200).render('commentPage', {posts: [postData["Cat"]], comments: commentData});
});

// We have gotten a request to add a stash. Respond.
app.post('/addStash', function (req, res, next) {

	var postObj = {
		stashId: req.body.stashId,
		topic: req.body.topic,
		linkURL: req.body.linkURL,
		text: req.body.text
	};

	console.log("\n\nServer got POST request:\n", postObj, "\nResponding with status code 200.");
	res.status(200).send("Success");
});

// We have gotten a request to add a post. Respond.
app.post('/posts/addPost', function (req, res, next) {

	var postObj = {
		postId: req.body.postId,
		topic: req.body.topic,
		user: req.body.user,
		imageURL: req.body.imageURL,
		linkURL: req.body.linkURL,
		title: req.body.title
	};

	console.log("\n\nServer got POST request:\n", postObj, "\nResponding with status code 200.");
	res.status(200).send("Success");
});

// We have gotten a request to add a comment. Respond.
app.post('/comments/addComment', function (req, res, next) {

	var postObj = {
		commentId: req.body.commentId,
    user: req.body.user,
    text: req.body.text
  };

	console.log("\n\nServer got POST request:\n", postObj, "\nResponding with status code 200.");
	res.status(200).send("Success");
});

// We have gotten an unknown request to add something. Respond.
app.post('*', function (req, res, next) {
	res.status(404).send("\n\nServer got POST request:\nPOST to unknown path.\nResponding with status code 404.");
});

//////////////////////////////////////////////////////////
// /DELETE END.
//////////////////////////////////////////////////////////


///////////////////////////////////////////////
////*Code Related to connecting to MongoDB*////
///////////////////////////////////////////////
//
//


//check if stash is in database
function isStashNameInDatabase(stashName){
	//RETURN A BOOLEAN TRUE STASH IS IN DATABASE
}

//check if post is in database
function isPostInDatabase(stashName, postID){
	//RETURN A BOOLEAN TRUE POST IS IN STASH IN THE DATABASE
}

function addStashToDatabase(/*parameters*/){
	//ADDS STASH TO DATABASE
}

function addPostToStashInDatabase(/*paramaeters*/){
	//ADDS POST TO STASH IN DATABASE
}

function addCommentToPostInDatabase(/*paramaeters*/){
	//ADDS COMMENT TO POST INSIDE CORRECT STASH IN DATABASE
}

// //////////////////////////////////////
// ////*Express Middleware Functions*////
// //////////////////////////////////////

app.use(bodyParser.json());

//a catch all for any http DELETE requests.  WE DO NOT ALLOW ANY DELETE REQUEST
app.delete('*', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --METHOD NOT ALLOLWED');
	res.status(405).send("DELETE is not allowed.");//note that status code 405 = Method not alowed
});


app.use(express.static('public'));

app.get('/', function (req, res, next) {
	req.url = '/stash';//if url is home directory change it to /stash so next middleware function can catch it
	next();
});

app.get('/stash', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --page found');
	//var content = {stashes: /*GET ALL STASHES FROM THE SERVERS AND PUT THEM HERE*/};
	res.status(200).render('stashPage', content);
});

app.get('/stash/:stashName', function (req, res, next) {
	var stashName = req.params.stashName;
	if(isStashNameInDatabase(stashName)){
		console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --page found');
		//var content = {posts: /*GET THIS STASH's POSTS FROM THE DATABASE AND PUT THEM HERE*/};
		res.status(200).render('postPage', content);
	}
});

// app.get('/stash/:stashName/:postId', function (req, res, next) {
// 	var stashName = req.params.stashName;
// 	var postId = req.params.postId;
// 	if(isStashNameInDatabase(stashName)){
// 		if(isPostInDatabase(stashName, postId){
// 			console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --page found');
// 			var content = /*JSON FORM OF CORRECT DYNAMIC CONTENT FOR COMMENT PAGE*/;
// 			res.status(200).render('commentPage', content);
// 		}
// 	}
// });



//catch any http get method with a path that can not be resolved above
app.get('*', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --PAGE NOT FOUND -- sent contents of 404.html');
	res.status(404).render('404Page');
});
/*
*
*add catch alls for other HTTP request methods if needeed
*
*/

console.log("---MongoDB URL = ", mongoURL);
MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    throw err;
  }
  console.log("---Server is connected to the MongoDB database", port);
  mongoDBDatabase = db;
 
  //start server
  app.listen(port, function () {
    console.log("---Server is listening on port ", port);
  });
});




