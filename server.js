console.log("Server JavaScript start.");
var fs = require('fs');
//var http = require('http')
var mongoDB = require('mongodb');
var express = require('express');
var expressServer = express();




//The default port for serve is 3117. However, the server will run with the port specified in the environment variable PORT if PORT is an environment variable
var port = 3117;
if(process.env.PORT){
	port = process.env.PORT;
}
expressServer.listen(port, function () {
    /*
	*
	*
	*insert callback code here
	*
	*
	*/
	console.log("---Server is listening on port ", port);

});


