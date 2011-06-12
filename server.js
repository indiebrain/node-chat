var ui = require('./interface/server.js'),
    ws = require('./websocket/server.js');

ui.listen(4000)
ws.listen(8080)