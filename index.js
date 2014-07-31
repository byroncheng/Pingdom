var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers")


var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/getCheck"] = requestHandlers.getCheck;
handle["/outages"] = requestHandlers.outages;

server.start(router.route, handle);
