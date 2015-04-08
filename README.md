# Week 11: Websockets

## Overview

This week we will explore an alternative communication mechanism
between the browser and server. Ajax changed the face of web
applications forever. Unfortunately, it was built on top of a protocol
that was never designed for application development - HTTP. Although
the HTTP API is exposed in the browser to circumvent page reloading,
Ajax still requires client pull operations. That is, it is not
possible for the server to push data to the browser. To fix this
problem a new technique was introduced - websockets. Websockets allow
full-duplex communication between browser and server. If state on the
server is updated then it can be communicated to all connected
browsers. We will look at how applications can take advantage of
websockets to provide real-time communication without polling.

## Readings

* [Websockets on Wikipedia](http://en.wikipedia.org/wiki/WebSocket)
* [Websockets on MDN](https://developer.mozilla.org/en-US/docs/WebSockets)
* [Socket.IO](http://socket.io)

