var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers")


var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/test"] = requestHandlers.test;
handle["/outages"] = requestHandlers.outages;
handle["/error"] = requestHandlers.error;

server.start(router.route, handle);
