var currentData = JSON.parse('{"birdsEnabled":false,"birds":0}');
var particles = 0;
var myTestParticle = new Particles();
var myChessBoard = new ChessBoard(8, 8);
var ws = null;
var chessEnabled = true;
//window.external.SetLocalProperty("prop:Browser60fps","1");
//var xjs = require('xjs');
//xjs.ready();

function WebSocketTest()
{
    if ("WebSocket" in window)
    {
        ws = new WebSocket("ws://zetaplays.sytes.net:8025/overlay/bird");
				
        ws.onopen = function()
        {
            // Web Socket is connected, send data using send()
            ws.send("start");
        };
		
        ws.onmessage = function (evt) 
        { 
            var received_msg = evt.data;
            if (received_msg === "bird") {
                addParticle("bird");
            }
            else if (received_msg === "birdsOn") {
                myTestParticle.enable();
            }
            else if (received_msg === "birdsOff") {
                myTestParticle.disable();
            }
            else if (received_msg === "offChess") {
                myChessBoard.enabled = false;
            }
            else if (received_msg === "kingChess") {
                myChessBoard.victoryCondition = "king";
            }
            else if (received_msg === "allChess") {
                myChessBoard.victoryCondition = "all";
            }
            else if (received_msg === "dangerChess") {
                myChessBoard.victoryCondition = "all";
                myChessBoard.gameMode = "dangerchess";
                myChessBoard.enabled = true;
                myChessBoard.reset();
            }
            else if (received_msg === "regularChess") {
                myChessBoard.victoryCondition = "king";
                myChessBoard.gameMode = "chess";
                myChessBoard.enabled = true;
                myChessBoard.reset();
            }
            else if (received_msg === "regularCheckers") {
                myChessBoard.victoryCondition = "all";
                myChessBoard.gameMode = "checkers";
                myChessBoard.enabled = true;
                myChessBoard.reset();
            }
            else if (received_msg === "resetChess") {
                myChessBoard.reset();
            }
            else {
                var command = received_msg.split(">");
                if (command[1] !== undefined) {
                    myChessBoard.moveCheck(command[0], command[1]);
                }
            }

        };
				
        ws.onclose = function()
        {
            WebSocketCheck();
                  // websocket is closed.
                  //alert("Connection is closed..."); 
        };
    }
            
    else
    {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    }
}

function WebSocketCheck(){
    if(!ws || ws.readyState == 3) WebSocketTest();
}

setInterval(WebSocketCheck, 5000);

function startGame() {
    for (var i = 0; i < 3; i++) {
	    addParticle("bird");
    }
    myGameArea.start();
    WebSocketTest();
}

function addParticle(name) {
	myTestParticle.add(name);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1366;
        this.canvas.height = 768;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

remove_item = function (arr, value) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            arr.splice(i, 1);
            return arr;
            break;
        }
    }
    return arr;
}

function updateGameArea() {
    myGameArea.clear();
    if (chessEnabled === true) {
        myChessBoard.update();
    }
    myTestParticle.update();
}