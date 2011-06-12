var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    ws = require('./ws.js')

var clients = {}

http.createServer(function(request, response) {
  
  response.writeHead(200, {
    'Content-Type' : 'text/html'
  })
  
  var rs = fs.createReadStream(__dirname + '/template.html')
  util.pump(rs, response)
  
}).listen(4000)

ws.createServer(function(websocket) {
  
  var username
  
  function naive_sanitize(message) {
    return message.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }
  
  function broadcast(message_origin, message) {
    for(var key in clients) {
      clients[key].write( new Date().toTimeString() + "[ "+ message_origin.trim() +" ]: " + naive_sanitize(message) )
    }
  }
  
  function broadcast_system_message(message) {
    broadcast("**** SYSTEM ****", message)
  }
  
  websocket.on('connect', function(resource) {
    websocket.write('Please input your username: ')
  })
  
  websocket.on('data', function(data) {
    if(!username) {
      username = data.toString()
      clients[username] = websocket
      websocket.write("Welcome "+ username+", you are now being placed into the chat...\n")
      broadcast_system_message(username + " has entered the chat.")
      return
    }
    broadcast(username, data)
  })
  
  websocket.on('close', function() {
    broadcast_system_message(username + " has left the chat.")
    delete clients[username]
  })
  
}).listen(8080)