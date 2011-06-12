var sys = require('sys'),
    ws = require('./ws.js');

// A map of all socket connections.
var clients = {};
module.exports = new ws.createServer(function(websocket) {
  
  // The username associated with a particular websocket.
  var username;
  
  /* 
    Perofrms some basic message sanitation to help prevent malicious posts by chat members.
  */
  function naive_sanitize(message) {
    return message.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  
  /*
    Broadcasts a message to all chat participants.
  */
  function broadcast(message_origin, message) {
    for(var key in clients) {
      clients[key].write( new Date().toTimeString() + "[ "+ message_origin.trim() +" ]: " + naive_sanitize(message) );
    }
  }
  
  /*
    Broadcasts a message from the chat system to all chat participants.
  */
  function broadcast_system_message(message) {
    broadcast("**** SYSTEM ****", message);
  }
  
  /*
    A handler used to process a new socket connection.
  */
  websocket.on('connect', function(resource) {
    websocket.write('Please input your username: ');
  });
  
  /*
    A hanlder used to process the receipt of data from a client.
  */
  websocket.on('data', function(data) {
    if(!username) {
      
      username = data.toString().trim();
      if (clients[username]) {
        
        // Don't clobber existing socket connecitons.
        websocket.write( "["+username+"] is already in use, please try another: ");
        username = null;
      } else {
        clients[username] = websocket;
        websocket.write("Welcome "+ username+", you are now being placed into the chat...\n");
        broadcast_system_message(username + " has entered the chat.");
      }
      return;
    }
    broadcast(username, data);
  });
  
  /*
    A hanlder used to process the termination of a client socket connection.
  */
  websocket.on('close', function() {
    broadcast_system_message(username + " has left the chat.");
    delete clients[username];
  });
  
});