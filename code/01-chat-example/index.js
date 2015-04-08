var app  = require('express')();
var http = require('http').Server(app);

// Require the socket.io module:
var io   = require('socket.io')(http);

// Serve the chat application's client code on '/':
app.get('/', function(req, res){
  // The client code is in just a single HTML file. It contains
  // the HTML, CSS, and JS. This is not good practice, however,
  // the example is small enough that we do this.
  res.sendfile(__dirname + '/index.html');
});

// Initialize the socket.io on a connection:
io.on('connection', function(socket){
  console.log('Chat user has connected.');

  // Register an event handler on the 'chat message' channel.
  // When we receive a message on the 'chat message' channel
  // we simply redirect the chat message to all the connected
  // browsers.
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  // An event handler for the 'disconnect' channel.
  socket.on('disconnect', function () {
    console.log('Chat user has disconnected.');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
