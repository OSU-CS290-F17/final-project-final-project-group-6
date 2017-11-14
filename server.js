console.log("Server JavaScript start.");
var fs = require('fs');
var path = require('path');
//var http = require('http') //we may not need HTTP module
var MongoClient = require('mongodb').MongoClient, test = require('assert');
var handlebars = require('handlebars');
var express = require('express');
var app = express();




//TEMPORARY STASH OBJECT -- remove once database is functional
function Stash(stashID, stashName, stashDescription){
	this.stashID = stashID
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
var allStashes = []
allStashes.push(new Stash(0, 'Cars', 'Cool Cars!!!'));
allStashes.push(new Stash(1, 'Cats', 'Everything to fill all your "Cat" needs.'));
allStashes.push(new Stash(2, 'Ferrets', 'If you dont like them, then leave!!!'));
allStashes.push(new Stash(3, 'Hackers', 'The people that live in my router and break my internet connection.'));
allStashes.push(new Stash(4, 'Invisible Glasses', 'Help people find theirs (they get lost easily)!'));
allStashes.push(new Stash(5, 'Metallic Fruit', 'Because we so bored that anything would seem entertaining.'));
allStashes.push(new Stash(6, 'Pocket-sized Elephants', "Who would't want one?"));
allStashes.push(new Stash(7, 'Starwars', 'Learn to use the force by going here.'));
allStashes.push(new Stash(8, 'Xbox', 'Share about one Bad4$$ Console!'));

//TEMPORARY POST OBJECT -- remove once database is functional










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

//convert from object to database
function isStashNameInDatabase(stashName){
	for(var i = 0; i < allStashes.length; i++){
		if(allStashes[i].getStashName().toLowerCase() === stashName.toLowerCase()){
			return true;
		}
	}
	return false;
}



//////////////////////////////////////
////*express Middleware Functions*////
//////////////////////////////////////

//a catch all for any http DELETE requests.  WE DO NOT ALLOW ANY DELETE REQUEST
app.delete('*', function (req, res, next) { 
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --METHOD NOT ALLOLWED');
	res.status(405).send("DELETE is not allowed.");//note that status code 405 = Method not alowed
});

app.get('/', function (req, res, next) {
	req.url = '/stash';//if url is home directory change it to /stash so next middleware function can catch it
	next();
});

app.get('/stash', function (req, res, next) {
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '"');
	var content = null;
	/*
	* add content of stash main page to "content" variable
	*/
	res.status(200).send(content);
});

app.get('/:pageType/:identifier', function (req, res, next) {
	var content = null;
	if(req.pageType === '/stash'){ //url is in the form /stash/:stashName
		if(isStashNameInDatabase(req.identifier)){
			console.log('Server received "' + req.method + '" request on the URL "' + req.url + '"');
			/*
			*add code to put site content into "content" variable for displaying all the posts in the current stash (req.identifier)
			*/
			res.status(200).send(content);
		}
		else{// if the requested url has a bad stash name move on to next middleware finction
			next();
		}
	}
	else if(req.pageType === '/post'){ // url is in the form /post/:postID
		console.log('Server received "' + req.method + '" request on the URL "' + req.url + '"');
		/*
		*code for displaying comments for the current stash
		*be sure to check that post is in database first
		*/
		res.status(200).send(content);
	}
	else{//if get request does not matsh the /stash/:stashName or /post/:postID form, then move on to next middleware function
		next();
	}
});

//catch any http get method with a path that can not be resolved above
app.get('*', function (req, res, next) {
	var content = null;
	/*
	*add code for any 404 error page and save it to "content" variable
	*/
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --PAGE NOT FOUND');
	res.status(404).send(content);
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
