This is a custom stream overlay, meant to be run in a web server and communicate to a control of some form via websockets.
It's mostly just visual, and requires external commands to control it.  It consists of three parts:
particles.js - This is my custom particle system.  In its current state, all it does is load a bird and fly it across the screen.
chessboard.js - This is a chess game!  It's made to do more than regular chess though, namely 4-team battle royales.
                It's designed to accept external commands via a chat elsewhere, passed in to here.
websocket.js - This is the websocket part, which accepts commands, and sends them to the other two parts.
