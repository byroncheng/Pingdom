var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers")


var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/getCheck"] = requestHandlers.getCheck;

server.start(router.route, handle);
/*$(document).ready(function() {
    var site = "https://api.pingdom.com/api/2.0/checks";
    var key = "wsr7j0dct331625r573kvv9b5x8ud7c1";
    var username = "me@mymailserver.net";
    var password = "MdKo5uecg19X";

    var from = "";
    var to = "";
    var order = "";


    $.ajax({
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password),
            "app-key": "wsr7j0dct331625r573kvv9b5x8ud7c1"
        },
        type: "GET",
        url: "https://api.pingdom.com/api/2.0/checks",
        dataType: "jsonp"
        
    }).then(function(data) {
        $('.checkID').html(data.id);
        $('.checkName').html(data.hostname);
        $('.debug').append(data.statuscode + "<br/>");
        $('.debug').append(data.statusdesc + "<br/>");
        $('.debug').append(data.errormessage + "<br/>");
    });
});*/