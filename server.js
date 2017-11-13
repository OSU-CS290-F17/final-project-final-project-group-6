console.log("Server JavaScript start.");
var fs = require('fs');
//var http = require('http') //we may not need HTTP module
var mongoDB = require('mongodb');
var express = require('express');
var app = express();


/*
*
*
*
*insert MongoDB code here (the "mongoDB" variable
*
*
*/



/*
*
*
*
*insert expredd code here (the "app" variable)
*
*
*/
//catch any http get method with a path that can not be resolved above
app.get('*', function (req, res, next) {
	/*
	*code for any 404 error page may want to be added here
	*/
  res.status(404).send("Requested page not found");
});
app.delete('*', function (req, res, next) { //catch all for any http delete requests.  WE DO NOT ALLOW ANY DELETE REQUEST
  console.log("Server received a DELETE request and it was denied.");
  res.status(405).send("DELETE is not allowed.");//statuscode 405 = Method not alowed
  console.log
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
expressServer.listen(port, function () {
    /*
	*
	*
	*insert callback code here
	* ----note we may not need anything here-----
	*
	*/
	console.log("---Server is listening on port ", port);

});


