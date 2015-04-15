module.exports = function (io) {
  // The nextBID keeps track of the next block id for a newly
  // created connection.
  var nextBID = 0;

  // This table keeps track of the blocks associated with each
  // connection. This is important because it maintains the
  // state of the "block world" so new clients will receive
  // the current state of the world.
  var blocks = {};

  io.sockets.on('connection', function (socket) {
    console.log('client connected.');

    // Generate the next block id:
    var bid = nextBID++;

    // Create a new "block":
    var block = {
      bid : bid,
      x   : 100,
      y   : 100
    };

    // Add the block to the table of blocks:
    blocks[bid] = block;

    // Send a message back to the connecting socket. The message type is
    // 'block' which indicates to the client that this is the new block
    // created for them. The data to be sent is the block we just created
    // and the blocks for all the other connected clients.
    socket.emit('block', {
      you  : block,
      them : blocks
    });

    // Now, send the block to all the other connected clients:
    socket.broadcast.emit('+block', block);

    //// Register Future Message Events ////

    // This message is sent from the client when the mouse moves across
    // the browser's view. The server must record the move and broadcast
    // to all the connected clients letting them know about the movement.
    socket.on('move', function (block) {
      // Update the block world state:
      var b = blocks[bid];
      b.x = block.x;
      b.y = block.y;
      // Broadcast to all connected clients:
      socket.broadcast.emit('move', block)
    });

    socket.on('disconnect', function () {
      console.log('client disconnected.');
      // Grab a reference to the block:
      var block = blocks[bid];
      // Remove block from table:
      delete blocks[bid];
      // Broadcast to all connected clients about block leaving:
      socket.broadcast.emit('-block', block);
    });
  });
};