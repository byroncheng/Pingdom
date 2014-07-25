var pingdom = require("pingdom");
var key = "wsr7j0dct331625r573kvv9b5x8ud7c1";
var username = "me@mymailserver.net";
var password = "MdKo5uecg19X";

function getcheck(){
    pingdom.getChecks(username, password, key, function(data){
            $(".checkID").html(data.checks[0].id);
    });
}
