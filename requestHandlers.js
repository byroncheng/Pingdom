var pingdom = require("pingdom");
var fs = require("fs");
var url = require("url");

var results;

function start(res){
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
	    	'Start Date: <input type="date" name="startDate" /><br>'+
	    	'End Date: <input type="date" name="endDate" /><br>'+
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

	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(body);
	res.end();

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

//refactored

function outages(res, req){
	console.log("Request handler 'outages' was called");
	var query = url.parse(req.url, true).query;

	if(query.startDate==''|query.endDate==''){
		var body =
		'<html>'+
		'<head>'+
			'<title>Pingdom Reporter</title>'+
		'</head>'+
		'<body>'+
	    '<div class = "checks">'+
	    	'<h1>Error</h1>'+
	    	'Missing Start or End date'+
	    	'<form action="/outages">'+
		    	'Start Date: <input type="date" name="startDate" /><br>'+
		    	'End Date: <input type="date" name="endDate" /><br>'+
		    	'<input type="submit" value="Get Check" />'+
	    	'</form>'+
	    '</div>'+
	    '<br><div class = "content"><a href="/">Go Back</a></div>'+
	    
	    '<div class="debug"></div>'+
	        
		'</body>'+
		'</html>';

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(body);
		res.end();	
	}
	else{
		getCheckID(res, req, getOutages);
	}
}

function getCheckID(res, req, callback){
	pingdom.getChecks(username, password, key, function(data){
		//console.log(data);
		checkID=data.checks[0].id;

		var pingdomChecks = 
		'<div class = "checkID">'+
			'Check ID is: '+data.checks[0].id+
		'</div>'+
		'<div class = "checkName">'+
			'Check name is: '+data.checks[0].name+
		'</div>';

		//run callback
		callback(checkID, pingdomChecks, res, req, showResults)
	});
}

function getOutages(checkID, pingdomChecks, res, req, callback){
	var fromDate = url.parse(req.url, true).query.startDate;
	var toDate = url.parse(req.url, true).query.endDate;
	

	pingdom.getSummaryOutage(username, password, key, checkID, {"from":dateToUnix(fromDate), "to":dateToUnix(toDate)}, function(data){
		//console.log(data.summary.states);

		var pingdomOutages = '<table>';

		data.summary.states.forEach(function(entry){
			//if (entry.status==='down'){
				pingdomOutages+=
				'<tr><td>'+
				//entry.timefrom+
				unixToDate(entry.timefrom)+'</td><td>'+entry.status+
				'</td></tr><tr><td>'+
				//entry.timeto+
				unixToDate(entry.timeto)+
				'</td><td>'+entry.status+'</td></tr>';
			//};
		});

		pingdomOutages += '</table>';
		callback(pingdomChecks, pingdomOutages, res)
	});
}

function showResults(pingdomChecks, pingdomOutages, res){
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

	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(body);
	res.end();
}


// helper functions
function unixToDate(unix_time){
	//create javascript date object, and get it into ms
	var fullDate = new Date(unix_time*1000);
	var year = fullDate.getFullYear();
	var month = fullDate.getMonth()+1;
	var date = fullDate.getDate();
	var time = fullDate.toLocaleTimeString();
	var hours = fullDate.getHours();
	var minutes = fullDate.getMinutes();
	var seconds = fullDate.getSeconds();

	return month+'/'+date+'/'+year+' '+time;
}

function dateToUnix(inputDate){
	var unixDate = new Date(inputDate);
	console.log('date is '+unixDate);
	console.log('unix time is '+(unixDate.getTime()/1000));
	return (unixDate.getTime()/1000);
}


// Export Methods
exports.start = start;
exports.outages = outages;