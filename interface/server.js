var sys = require('sys')
    http = require('http'),
    util = require('util'),
    fs = require('fs');

module.exports = new require('http').createServer(function(request, response) {
  
  /*
    Write the successful HTTP response header
  */
  response.writeHead(200, {
    'Content-Type' : 'text/html'
  });
  
  /*
    Stream the content of the interface back to the browser.
  */
  var rs = fs.createReadStream(__dirname + '/interface.html');
  util.pump(rs, response);
  
})