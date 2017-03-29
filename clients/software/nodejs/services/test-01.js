/**
 * Created by sus on 2016/3/17.
 */

var http = require('http');
var server = http.createServer(function(req,res){
	res.witeHead(200,{'Content-Type':'text/plain'});
	res.end('Hello World\n');
});
server.listen(3000);