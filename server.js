console.log("Server JavaScript start.");
var fs = require('fs');
var path = require('path');
//var http = require('http') //we may not need the HTTP module
var MongoClient = require('mongodb').MongoClient, test = require('assert');
var handlebars = require('handlebars');
var express = require('express');
var app = express();

//read files
var fileIndexJS = fs.readFileSync('index.js', 'utf8');
var fileStyleCSS = fs.readFileSync('style.css', 'utf8');
var fileChestImage = fs.readFileSync('site_photos/chest.jpg');
var fileNoTreasureImage = fs.readFileSync('site_photos/no_treasure.png');

//var file404HTML = fs.readFileSync('404.html', 'utf8');


//TEMPORARY STASH OBJECT -- remove once database is functional
function Stash(stashID, stashName, stashDescription){
	this.stashID = stashID;
	this.stashName = stashName;
	this.stashDescription = stashDescription;
	this.getStashID = function () {
		return this.stashID;
	}
	this.getStashName = function () {
		return this.stashName;
	}
	this.getStashDescription = function () {
		return this.stashDescription;
	}
}
var allStashes = [];
allStashes.push(new Stash(0, 'Cars', 'Cool Cars!!!'));
allStashes.push(new Stash(1, 'Cats', 'Everything to fill all your "Cat" needs.'));
allStashes.push(new Stash(2, 'Ferrets', 'If you dont like them, then leave!!!'));
allStashes.push(new Stash(3, 'Hackers', 'The people that live in my router and break my internet connection.'));
allStashes.push(new Stash(4, 'Invisible Glasses', 'Help people find theirs (they get lost easily)!'));
allStashes.push(new Stash(5, 'Metallic Fruit', 'Because we so bored that anything would seem entertaining at this point.'));
allStashes.push(new Stash(6, 'News', "Because we aren't scared enough as it is...  So lets talk about the News."));
allStashes.push(new Stash(7, 'Pocket-sized Elephants', "Who would't want one?"));
allStashes.push(new Stash(8, 'Starwars', 'Learn to use the force by going here.'));
allStashes.push(new Stash(9, 'Xbox', 'Share about one Bad4$$ Console!'));

//TEMPORARY POST OBJECT -- remove once database is functional
function Post(postID, stashID, postTag, postScore, postUser, postImgURL, postBody){
	this.postID = postID;
	this.stashID = stashID;
	this.postTag = postTag;
	this.postScore = postScore;
	this.postUser = postUser;
	this.postImgURL = postImgURL;
	this.postBody = postBody;
	this.getPostID = function () {
		return this.postID;
	}
	this.getStashID = function () {
		return this.stashID;
	}
	this.getPostTag = function () {
		return this.postTag;
	}
	this.getPostScore = function () {
		return this.postScore;
	}
	this.getPostUser = function () {
		return this.postUser;
	}
	this.getPostImgURL = function () {
		return this.postImgURL;
	}
	this.getPostBody = function () {
		return this.postBody;
	}
}
var allPosts = [];
allPosts.push(new Post(0, 0, "New cars", 5, "BlueZebra", "https://auto.ndtvimg.com/car-images/medium/ferrari/gtc4lusso/ferrari-gtc4lusso.jpg?v=11", "Cool new car on the market."));
allPosts.push(new Post(1, 6, "Weather", 203, "GreenOx", null, "Be ready for rain."));
allPosts.push(new Post(2, 1, "Funny", 950, "RedSeagull", "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg", "Hidden cat."));
		
//TEMPORARY COMMENT OBJECT -- remove once database is functional
function Comment(commentID, postID, commentUser, commentBody){
	this.commentID = commentID;
	this.postID = postID;
	this.commentUser = commentUser;
	this.commentBody = commentBody;
	this.getCommentID = function () {
		return this.commentID;
	}
	this.getPostID = function () {
		return this.postID;
	}
	this.getCommentUser = function () {
		return this.commentUser;
	}
	this.getCommentBody = function () {
		return this.commentBody;
	}
}
var allComments = [];
allComments.push(new Comment(0, 0, "RedSeagull", "I WANT ONE!!!!!!"));
allComments.push(new Comment(1, 0, "ToastyJungle", "I lost mine :("));





///////////////////////////////////////////////
////*Code Related to connecting to MongoDB*////
///////////////////////////////////////////////
//pull password from database from a special file in parent directory of current directory
var databasePassword = fs.readFileSync('../database-pass.txt', 'utf8')
var databaseConnectionString = "mongodb://HauntedWAMPUS:" + databasePassword + "@cluster0-shard-00-00-pdrgi.mongodb.net:27017,cluster0-shard-00-01-pdrgi.mongodb.net:27017,cluster0-shard-00-02-pdrgi.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
/*
*
*
*insert MongoDB code here (the "MongoClient" variable
*
*
*/
MongoClient.connect(databaseConnectionString, function(err, db) {
	test.equal(null, err);
	if(err){
		throw err;
	}
	console.log("Successfully connected to MongoDB!");
});

//!!!!!!convert from object to database!!!!!!!!!!!!
//check if stash is in database
function isStashNameInDatabase(stashName){
	for(var i = 0; i < allStashes.length; i++){
		if(allStashes[i].getStashName().toLowerCase() === stashName.toLowerCase()){
			return true;
		}
	}
	return false;
}

//!!!!!!convert from object to database!!!!!!!!!!!!
//check if post is in database
function isPostInDatabase(postID){
	for(var i = 0; i < allPosts.length; i++){
		if(allPosts[i].getPostID == postID){//using == instead of === on purpose
			return true;
		}
	}
	return false;
}




//////////////////////////////////////
////*Express Middleware Functions*////
//////////////////////////////////////

//a catch all for any http DELETE requests.  WE DO NOT ALLOW ANY DELETE REQUEST
app.delete('*', function (req, res, next) { 
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --METHOD NOT ALLOLWED');
	res.status(405).send("DELETE is not allowed.");//note that status code 405 = Method not alowed
});

app.get('/style.css', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --Contents of style.css sent');
	res.type('text/css').status(200).send(fileStyleCSS);
});

app.get('/index.js', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --Contents of index.js sent');
	res.status(200).send(fileIndexJS);
});

app.get('/site_photos/chest.jpg', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --chest.jpg sent');
	res.type('image/jpeg').status(200).send(fileChestImage);
});

app.get('/site_photos/no_treasure.png', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --no_treasure.jpg sent');
	res.type('image/png').status(200).send(fileNoTreasureImage);
});

app.get('/', function (req, res, next) {
	req.url = '/stash';//if url is home directory change it to /stash so next middleware function can catch it
	next();
});

app.get('/stash', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --page found');
	var content;
	/*
	* add content of stash main page to "content" variable
	*/
	res.status(200).send(content);
});

app.get('/:pageType/:identifier', function (req, res, next) {
	var pageType = req.params.pageType;
	var identifier = req.params.identifier;
	var content;
	if(pageType === 'stash'){ //url is in the form /stash/:stashName
		if(isStashNameInDatabase(identifier)){
			console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --page found');
			/*
			*add code to put site content into "content" variable for displaying all the posts in the current stash (identifier)
			*/
			res.status(200).send(content);
		}
	}
	else if(pageType === 'post'){ // url is in the form /post/:postID
		if(isPostInDatabase(identifier)){
			console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --page found');
			/*
			*add code to put site content into "content" variable for displaying all the comments for the current post (identifier)
			*/
			res.status(200).send(content);
		}
	}
	next();
});

//catch any http get method with a path that can not be resolved above
app.get('*', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --PAGE NOT FOUND');
	//res.status(200).send(file404HTML);
	res.status(404).sendFile(path.join(__dirname, '404.html'));
});
/*
*
*add catch alls for other HTTP request methods if needeed
*
*/




//The default port for serve is 3117. However, the server will run with the port specified in the environment variable PORT if PORT is an environment variable
var port = 3117; // Dustin:  I chose port 3117 because the engr server is haviing too many people from this class tryimng to use port 3000
if(process.env.PORT){
	port = process.env.PORT;
}
//start server
app.listen(port, function () {
    /*
	*insert callback code here
	* ----note we may not need anything here-----
	*/
	console.log("---Server is listening on port ", port);
});
