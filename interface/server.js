var sys = require('sys')
    http = require('http'),
    util = require('util'),
    fs = require('fs'),

module.exports = new require('http').createServer(function(request, response) {
  
  response.writeHead(200, {
    'Content-Type' : 'text/html'
  })
  
  var rs = fs.createReadStream(__dirname + '/interface.html')
  util.pump(rs, response)
  
})