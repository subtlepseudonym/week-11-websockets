////
//// Block Client JS Library
////

// A global variable to keep track of our block:
var block;

// Displays the position of the block in the view:
function displayPosition(x, y) {
  $('#pos').html('top: ' + y + ', left: ' + x);
}

// Call the jquery ready handler to ensure that the DOM is constructed:
$(function () {
  // Get a reference to the board where all the blocks will live:
  var board  = $('#board');

  // Make a websocket connection:
  var socket = io.connect();

  //// Install Message Handlers ////

  // The first one is for the confirmed connection:
  socket.on('connect', function () {
    // Empty the board if there is anything already on it:
    board.empty();

    // The 'block' message is sent from the server to the client to
    // inform the client of its block ID and current coordinates.
    socket.on('block', function (message) {
      // Record the block for this client in the global variable:
      block = message.you;
      // Grab the "others" blocks that exist:
      var others = message.them;

      // Create a new <div> element representing the block in the view:
      var block_div = $('<div class="block" id="block_' + block.bid + '">');
      // Set the HTML of the block <div> to be the id:
      block_div.html(block.bid);

      // Set the CSS coordinates of the block <div> to the coordinates received:
      block_div.css({'top' : block.y,
                     'left': block.x});
      // Add the block <div> to the board:
      board.append(block_div);

      // Display the position to the view:
      displayPosition(block.x, block.y);

      // Iterate over the other blocks that exist, creating a new <div> element
      // for each of the other blocks.
      for (var bid in others) {
        var other = others[bid];
        if (other.bid != block.bid) {
            var other_div = $('<div class="block" id="block_' + other.bid + '">');
            other_div.html(other.bid);
            other_div.css({'top' : other.y,
                           'left': other.x});
            board.append(other_div);
        }
      }

      // Now, install an event handler to capture the mousemove event to update
      // the coordinates of this client's block and send a message to the server
      // to broadcast the change to all connected clients:
      board.mousemove(function (e) {
        // Update the displayed position:        
        displayPosition(e.pageX, e.pageY);
        // Change the coordinates of the block:
        block.x = e.pageX;
        block.y = e.pageY;
        // Update the coordinates of the displayed block <div>:
        $('#block_' + block.bid).css({'top' : e.pageY,
                                     'left': e.pageX});
        // Notify server of the change in position:
        socket.emit('move', block);
      });

    });

    // The '+block' message indicates that a new block has joined the world.
    socket.on('+block', function (block) {
      // We create a new block <div>, set the HTML as the block's block id,
      // set its coordinates using CSS, and then append to the board.
      var block_div = $('<div class="block" id="block_' + block.bid + '">');
      block_div.html(block.bid);
      block_div.css({'top' : block.x,
                     'left': block.y});
      board.append(block_div);
    });

    // The '-block' message indicates that a block has left the block world.
    // We display a message to the view telling the user that the block left
    // the world and then fade out after 800 milliseconds.
    socket.on('-block', function (block) {
      // Display the message:
      $('#msg').html('Block ' + block.bid + ' left the scene.');
      // Remove the block <div> from the view:
      $('#block_' + block.bid).remove();
      // Fade out the message:
      $('#msg').fadeOut(800, function () {
        $('#msg').empty().show();
      });

    });

    // The 'move' message indicates that a block has moved its coordinates.
    // We simply set the coordinates of the block <div> to the coordinates
    // we received from the server.
    socket.on('move', function (block) {
      $('#block_' + block.bid).css({'top' : block.y,
                                    'left': block.x});
    });
  });

});
