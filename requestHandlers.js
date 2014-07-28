var cheerio = require("cheerio");
var pingdom = require("pingdom");
var script = require("./script");
var key = "wsr7j0dct331625r573kvv9b5x8ud7c1";
var username = "me@mymailserver.net";
var password = "MdKo5uecg19X";
var results;
var pingdomChecks;
var pingdomOutages;
var checkID;

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

exports.start = start;
exports.getCheck = getCheck;


function summaryOutage(callback){
	if (err) {
		console.log("An error ocurred in function summaryOutage");
		callback(err);
	}
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
	});
}

function convertDate(unix_time){
	//create javascript date object, and get it into ms
	var date = new Date(unix_time*1000);
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	return month+'/'+day+'/'+year+' '+hours+':'+minutes+':'+seconds;
}