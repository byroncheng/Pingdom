var pingdom = require("pingdom");
var fs = require("fs");

var results;

function start(response){
	console.log("Request handler 'start' was called.");
	var hasCreds;

	var body =
	'<html>'+
	'<head>'+
		'<title>Pingdom Reporter</title>'+
	'</head>'+
	'<body>'+
    '<div class = "checks">'+
    	'<h1>Pingdom Checks</h1>'+
    	'<form action="/outages">'+
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

    '<div class="debug">'+'</div>'+
    
    
	'</body>'+
	'</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();

	var credsJSON = fs.readFile('credentials.json', 'utf-8', function(err,data){
		if (err){
			console.log("Missing Credentials.json");
			hasCreds = "Missing Credentials.json";
		}
		else{
			hasCreds = "Credentials.json was loaded";
			var creds = JSON.parse(data);

			//loads in authentication for pingdom api
			key = creds.key;
			username = creds.username;
			password = creds.password;
		}

	});
	
}

function getCheck(response){
	console.log("Request handler 'getCheck' was called");

	var body =
	'<html>'+
	'<head>'+
		'<title>Pingdom Reporter</title>'+
	'</head>'+
	'<body>'+
    '<div class = "checks">'+
    	'<h1>Pingdom Checks</h1>'+
    	pingdomChecks+
    	'<h1>Outage List</h2>'+
    	pingdomOutages+
    '</div>'+
    '<br><div class = "content"><a href="/">Go Back</a></div>'+
    
    '<div class="debug"></div>'+
        
	'</body>'+
	'</html>';


	pingdom.getChecks(username, password, key, function(data){
		console.log(data);
		checkID=data.checks[0].id;

		pingdomChecks = 
		'<div class = "checkID">'+
			'Check ID is: '+data.checks[0].id+
		'</div>'+
		'<div class = "checkName">'+
			'Check name is: '+data.checks[0].name+
		'</div>';

		pingdom.getSummaryOutage(username, password, key, checkID, {"from":"1404172800"}, function(data){
			var pingdomOutages;

			data.summary.states.forEach(function(entry){
				if (entry.status==='down'){

					pingdomOutages+=
					'<div class = "outage">'+
					'Down at '+
					//entry.timefrom+
					convertDate(entry.timefrom)+
					', up at '+
					//entry.timeto+
					convertDate(entry.timeto)+
					'</div>';


					console.log('Down at '+entry.timefrom+', up at '+entry.timeto);
				};
			});

			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(body);
			response.end();
		});
	});
}

//refactored

function outages(response){
	console.log("Request handler 'outages' was called");
	getCheckID(response, getOutages);
}

function getCheckID(response, callback){
	pingdom.getChecks(username, password, key, function(data){
		console.log(data);
		checkID=data.checks[0].id;

		var pingdomChecks = 
		'<div class = "checkID">'+
			'Check ID is: '+data.checks[0].id+
		'</div>'+
		'<div class = "checkName">'+
			'Check name is: '+data.checks[0].name+
		'</div>';

		//run callback
		callback(checkID, pingdomChecks, response, showResults)
	});
}

function getOutages(checkID, pingdomChecks, response, callback){
	pingdom.getSummaryOutage(username, password, key, checkID, {"from":"1404172800"}, function(data){
		//console.log(data.summary.states);

		var pingdomOutages = '<table>';

		data.summary.states.forEach(function(entry){
			//if (entry.status==='down'){
				pingdomOutages+=
				'<tr><td>'+
				//entry.timefrom+
				convertDate(entry.timefrom)+'</td><td>'+entry.status+
				'</td></tr><tr><td>'+
				//entry.timeto+
				convertDate(entry.timeto)+
				'</td><td>'+entry.status+'</td></tr>';
			//};
		});

		pingdomOutages += '</table>';
		callback(pingdomChecks, pingdomOutages, response)
	});
}

function showResults(pingdomChecks, pingdomOutages, response){
	var body =
	'<html>'+
	'<head>'+
		'<title>Pingdom Reporter</title>'+
	'</head>'+
	'<body>'+
    '<div class = "checks">'+
    	'<h1>Pingdom Checks</h1>'+
    	pingdomChecks+
    	'<h1>Outage List</h2>'+
    	pingdomOutages+
    '</div>'+
    '<br><div class = "content"><a href="/">Go Back</a></div>'+
    
    '<div class="debug"></div>'+
        
	'</body>'+
	'</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}


// helper functions
function convertDate(unix_time){
	//create javascript date object, and get it into ms
	var fullDate = new Date(unix_time*1000);
	var year = fullDate.getFullYear();
	var month = fullDate.getMonth();
	var date = fullDate.getDate();
	var time = fullDate.toLocaleTimeString();
	var hours = fullDate.getHours();
	var minutes = fullDate.getMinutes();
	var seconds = fullDate.getSeconds();

	return month+'/'+date+'/'+year+' '+time;
}



// Export Methods
exports.start = start;
exports.getCheck = getCheck;
exports.outages = outages;