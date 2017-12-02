console.log("Server JavaScript start.");
var fs = require('fs');
var path = require('path');
//var http = require('http') //we may not need the HTTP module
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

app.post('*', function (req, res, next) {
	res.status.send(req.body);
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





//start server
app.listen(port, function () {
    /*
	*insert callback code here
	* ----note we may not need anything here-----
	*/
	console.log("---Server is listening on port ", port);
});
