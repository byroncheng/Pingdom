var cheerio = require("cheerio");
var pingdom = require("pingdom");
var script = require("./script");
var key = "wsr7j0dct331625r573kvv9b5x8ud7c1";
var username = "me@mymailserver.net";
var password = "MdKo5uecg19X";
var results;

function start(response){
	console.log("Request handler 'start' was called.");

	var body =
	'<html>'+
	'<head>'+
		'<title>Pingdom Reporter</title>'+
	'</head>'+
	'<body>'+
    '<div class = "checks">'+
    	'<h1>Pingdom Checks</h1>'+
    	'<form action="/getCheck">'+
    	'<input type="submit" value="Get Check" />'+
    	'</form>'+
        '<div class = "checkID">'+
        '</div>'+
        '<div class = "checkName"></div>'+
    '</div>'+
    '<div class = "outages">'+
        '<h1>Pingdom Outages</h1>'+
        '<div class = "content"></div>'+
    '</div>'+

    '<div class="debug"></div>'+
    
    
	'</body>'+
	'</html>';


	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function getCheck(response){
	console.log("Request handler 'getCheck' was called");

	pingdom.getChecks(username, password, key, function(data){
			console.log("inside Pingdom API");
			console.log(data);
			results=data;

			var body =
			'<html>'+
			'<head>'+
				'<title>Pingdom Reporter</title>'+
			'</head>'+
			'<body>'+
		    '<div class = "checks">'+
		    	'<h1>Pingdom Checks</h1>'+
		        '<div class = "checkID">'+
		        	'Check ID is: '+results.checks[0].id+
		        '</div>'+
		        '<div class = "checkName">'+
		        	'Check name is: '+results.checks[0].name+
		        '</div>'+

		    '</div>'+
		    '<div class = "content"><a href="/">Go Back</a></div>'+
		    
		    '<div class="debug"></div>'+
		        
			'</body>'+
			'</html>';

			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(body);
			response.end();

			
	});



	console.log("outside pingdom call");


}

exports.start = start;
exports.getCheck = getCheck;