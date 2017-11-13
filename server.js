console.log("Server JavaScript start.");
var fs = require('fs');
//var http = require('http') //we may not need HTTP module
var MongoClient = require('mongodb').MongoClient, test = require('assert');
var express = require('express');
var app = express();


//pull password from database from a special file in parent directory of current directory
var databasePassword = fs.readFileSync('../database-pass.txt', 'utf8')
var datavaseConnectionString = "mongodb://HauntedWAMPUS:" + databasePassword + "@cluster0-shard-00-00-pdrgi.mongodb.net:27017,cluster0-shard-00-01-pdrgi.mongodb.net:27017,cluster0-shard-00-02-pdrgi.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
/*
*
*
*
*insert MongoDB code here (the "MongoClient" variable
*
*
*/
MongoClient.connect(datavaseConnectionString, function(err, db) {
	test.equal(null, err);
	if(err){
		throw err;
	}
	console.log("Successfully connected to MongoDB!");
});



/*
*
*
*
*insert expredd code here (the "app" variable)
*
*	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '"');
*
*/
//catch any http get method with a path that can not be resolved above
app.get('*', function (req, res, next) {
	/*
	*code for any 404 error page may want to be added here
	*/
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --PAGE NOT FOUND');
	res.status(404).send("Requested page not found");
});
app.delete('*', function (req, res, next) { //catch all for any http delete requests.  WE DO NOT ALLOW ANY DELETE REQUEST
	console.log('Server received "' + req.method + '" request on the URL "' + req.url + '" --METHOD NOT ALLOLWED');
	res.status(405).send("DELETE is not allowed.");//statuscode 405 = Method not alowed
});
/*
*Continue adding express code 
*
*
*add a catch alls for other HTTP request methods if needeed
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
	*
	*
	*insert callback code here
	* ----note we may not need anything here-----
	*
	*/
	console.log("---Server is listening on port ", port);

});


