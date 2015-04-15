var express      = require('express');        // An HTTP web framework
var path         = require('path');           // A library for manipulating paths
var logger       = require('morgan');         // A library logging HTTP requests
var cookieParser = require('cookie-parser');  // A library for parsing cookies
var bodyParser   = require('body-parser');    // A library for parsing HTTP request bodies
var socketio     = require('socket.io');      // A library for websocket support
var http         = require('http');           // A library for HTTP server support

// Create the Express application server:
var app = express();

// Create the socketio websocket server:
var server = http.createServer(app)
var io     = socketio(server);

// Use our library to initialize message events:
var blocks = require('./libs/blocks.js');
blocks(io);

//// Add Express Middleware ////
app.use(logger('dev'));                                   // Add morgan's 'dev' logger
app.use(bodyParser.json());                               // Add json parsing support
app.use(bodyParser.urlencoded({ extended: false }));      // Add UTF-8 encoding parsing support
app.use(cookieParser());                                  // Add cookie header parsing support
app.use(express.static(path.join(__dirname, 'public')));  // Add static file serving in ./public directory
////////////////////////////////

module.exports = server;
