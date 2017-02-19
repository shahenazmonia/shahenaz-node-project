var fs = require('fs');
var html = fs.readFile(__dirname+'index.html', function(err, data){
  console.log(data);
});

var http = require('http');
http.createServer(function(req,res){
  res.end(html);
}).listen(8080,function(){
  //console.log('Listening on 8080');
});
