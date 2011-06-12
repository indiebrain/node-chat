var ui = require('./interface/server.js'),
    ws = require('./websocket/server.js');

// Start the interface server
ui.listen(4000);

// Start the socket server
ws.listen(8080);