const tops = 5; //25;
const lefts = 5; //25;
var tileSize = 90;
var piecetypes = ["r", "h", "b", "r", "h", "b", "q", "q", "p", "c"];

var layouts = new Object();
layouts.chess = [
    "r2", "h2", "b2", "q2", "k2", "b2", "h2", "r2",
    "p2", "p2", "p2", "p2", "p2", "p2", "p2", "p2",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "p1", "p1", "p1", "p1", "p1", "p1", "p1", "p1",
    "r1", "h1", "b1", "q1", "k1", "b1", "h1", "r1"
];

layouts.checkers = [
    "c2", "", "c2", "", "c2", "", "c2", "",
    "", "c2", "", "c2", "", "c2", "", "c2",
    "c2", "", "c2", "", "c2", "", "c2", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "c1", "", "c1", "", "c1", "", "c1",
    "c1", "", "c1", "", "c1", "", "c1", "",
    "", "c1", "", "c1", "", "c1", "", "c1"
];

layouts.dangerChess = [
    "*2", "*2", "*2", "", "", "*4", "*4", "*4",
    "*2", "k2", "*2", "", "", "*4", "k4", "*4",
    "*2", "*2", "*2", "", "", "*4", "*4", "*4",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "*1", "*1", "*1", "", "", "*3", "*3", "*3",
    "*1", "k1", "*1", "", "", "*3", "k3", "*3",
    "*1", "*1", "*1", "", "", "*3", "*3", "*3"
];

//todo: make chess pieces, figure out how to dynamically color them for teams
//ctx.filter = 'hue-rotate(90deg)';   for coloring super simple
class ChessBoard {
    constructor(columns, rows){
        this.columns = columns;
        this.rows = rows;
        this.enabled = true;
        this.takenPieces = 0;
        this.chessPieces = [];
        this.victoryCondition = "all";
        this.gameMode = "dangerchess";
        //this.add("p", "blue");
        this.populate(this.gameMode);
    }
    update() {
        if (this.enabled) {
            this.draw();
            for (var i = 0; i < this.chessPieces.length; i++) {
//                this.chessPieces[i].col = Math.floor(Math.random()*this.columns);
//                this.chessPieces[i].row = Math.floor(Math.random()*this.rows);
                this.chessPieces[i].update();
            }
        }
    }
    populate(style, randomize){
        var layout = [];
        if (style === "chess"){
            layout = layouts.chess;
        }
        else if (style === "checkers"){
            layout = layouts.checkers;
        }
        else if (style === "dangerchess"){
            layout = layouts.dangerChess;
        }

        var position = 0;
        for (var j = 0; j < this.rows; j++) {
            for (var i = 0; i < this.columns; i++) {
                var piece = layout[position];
                if (piece !== "") {
                    var type = piece.substring(0, 1);
                    if (type === "*") { type = piecetypes[Math.floor(Math.random()*piecetypes.length)]; }
                    var team = Number(piece.substring(1,2));
                    this.add(i, j, type, team);

                }
                position++;
            }
        }

    }
    add(row, col, type, team){
        if (this.enabled) {
            var templength = this.chessPieces.length;
            this.chessPieces[templength] = new ChessPiece(row, col, type, team);
        }
    }
    draw() {
        var ctx = myGameArea.context;
		ctx.imageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.save();
        var flipflop = false;
        for (var j = 0; j < this.rows; j++) {
            for (var i = 0; i < this.columns; i++) {
                if ((i%2 === 0)&&(j%2 === 0)) {
                    flipflop = false;
                    ctx.fillStyle = "black";
                }
                else if ((i%2 === 0)&&(j%2 !== 0)) {
                    flipflop = false;
                    ctx.fillStyle = "brown";
                }
                else if ((i%2 !== 0)&&(j%2 === 0)) {
                    flipflop = false;
                    ctx.fillStyle = "brown";
                }
                else if ((i%2 !== 0)&&(j%2 !== 0)) {
                    flipflop = false;
                    ctx.fillStyle = "black";
                }
                //ctx.beginPath();
                ctx.fillRect(lefts+tileSize*i, tops+tileSize*j, tileSize, tileSize);
                ctx.strokeStyle = '#333333';
                ctx.lineWidth   = 3;
                ctx.strokeRect(lefts+tileSize*i, tops+tileSize*j, tileSize, tileSize);
                ctx.strokeStyle = "black";
                ctx.lineWidth   = 8;
                ctx.strokeRect(lefts-5, tops-5, tileSize*this.columns+10, tileSize*this.rows+10);
                ctx.fillStyle = "black";
                ctx.fillRect(tileSize*8, 0, tileSize*2, tileSize*8);
                ctx.fillStyle = "black";
                ctx.fillRect(0, tileSize*8, tileSize*10, tileSize);

                ctx.fill();
            }
        }
        ctx.restore();
        this.drawGrid();
    }
    drawGrid(){
        var ctx = myGameArea.context;
        ctx.font = "38px Arial";
        ctx.fillStyle = "#00FF00";
        var letters = ["H", "G", "F", "E", "D", "C", "B", "A"];
        var numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];
        for (var i = 0; i < this.columns; i++) {
            ctx.fillText(letters[i],lefts+22+tileSize*i,tops+5+tileSize*8+25); 
            ctx.fillText(numbers[i],lefts+22+tileSize*8,tops+5+tileSize*i+50); 
        }

    }
    winCheck(){
        var teams = [];
        var kings = 0;
        if (this.gameMode === "dangerChess") { teams = 4; }
        for (var i = 0; i < this.chessPieces.length; i++) {
            if (this.chessPieces[i].active) {
                if (this.chessPieces[i].type === "k") {
                    kings++;
                }
                var teamcheck = false;
                for (var j = 0; j < teams.length; j++) {
                    if (teams[j] === this.chessPieces[i].team){
                        teamcheck = true;
                    }
                }
                if (!teamcheck) {
                    teams[teams.length] = this.chessPieces[i].team;
                }
            }
        }
        if ((this.victoryCondition === "king")&&(kings === 1)) {
            this.reset();
        }
        if ((this.victoryCondition === "all")&&(teams.length === 1)) {
            this.reset();
        }

    }
    reset(){
        this.chessPieces = [];
        this.takenPieces = 0;
        this.populate(this.gameMode);
    }
    moveCheck(startpos, endpos) {
        if (this.enabled) {
            var spp = -1;
            var epp = -1;
            var sp = [letterToNumber(startpos.substring(0, 1)), letterToNumber(startpos.substring(1, 2))];
            var ep = [letterToNumber(endpos.substring(0, 1)), letterToNumber(endpos.substring(1, 2))];
            for (var i = 0; i < this.chessPieces.length; i++) {
                if ((this.chessPieces[i].col === sp[1])&&(this.chessPieces[i].row === sp[0])) {
                    spp = i;
                }
                else if ((this.chessPieces[i].col === ep[1])&&(this.chessPieces[i].row === ep[0])) {
                    epp = i;
                }
            }
            if ((spp != -1)&&(this.validSpot(ep[0], ep[1]))) {

                if (this.validMove(this.chessPieces[spp], ep)) {
                    var tempmove = [];
                    tempmove[0] = this.chessPieces[spp].row - ep[0];
                    tempmove[1] = this.chessPieces[spp].col - ep[1];
                    if (((this.chessPieces[spp].type === "c")||(this.chessPieces[spp].type === "cc")) && (Math.abs(tempmove[0]) === 2)) {
                        var tpp = [];
                        tpp[0] = ep[0];
                        tpp[1] = ep[1];
                        tempmove[0] = tempmove[0]/2;
                        tempmove[1] = tempmove[1]/2;
                        tpp[0] += tempmove[0];
                        tpp[1] += tempmove[1];
                        for (var i = 0; i < this.chessPieces.length; i++) {
                            if ((this.chessPieces[i].col === tpp[1])&&(this.chessPieces[i].row === tpp[0])) {
                                this.chessPieces[i].row = 9;
                                if (this.takenPieces > 15) {
                                    this.chessPieces[i].row = 10;
                                }
                                this.chessPieces[i].col = 0;
                                this.chessPieces[i].taken = this.takenPieces;
                                this.takenPieces++;
                                this.chessPieces[i].active = false;
                            }
                        }
                    }
                    //TODO: victory conditions
                    //modes: kill everything on a team, kill the king and the team goes
                    if ((this.chessPieces[spp].type === "q")||(this.chessPieces[spp].type === "r")||(this.chessPieces[spp].type === "b")) {
                        var looper = true;
                        while (looper) {
                            var tempPos = [];
                            tempPos[0] = this.chessPieces[spp].row;
                            tempPos[1] = this.chessPieces[spp].col;
                            if (tempmove[0] < 0) { tempPos[0]++; }
                            else if (tempmove[0] > 0) { tempPos[0]--; }
                            if (tempmove[1] < 0) { tempPos[1]++; }
                            else if (tempmove[1] > 0) { tempPos[1]--; }
                            if (this.chessPieces[spp].team === this.teamcheck(tempPos)) {
                                ep[0] = this.chessPieces[spp].row;
                                ep[1] = this.chessPieces[spp].col;
                            }
                            else if (this.occupied(tempPos)) {
                                ep[0] = tempPos[0];
                                ep[1] = tempPos[1];
                                for (var i = 0; i < this.chessPieces.length; i++) {
                                    if ((this.chessPieces[i].col === ep[1])&&(this.chessPieces[i].row === ep[0])) {
                                        epp = i;
                                    }
                                }
                                looper = false;
                            }
                            else {
                                this.chessPieces[spp].row = tempPos[0];
                                this.chessPieces[spp].col = tempPos[1];
                            }
                            if ((this.chessPieces[spp].row === ep[0])&&(this.chessPieces[spp].col === ep[1])){
                                looper = false;
                            }
                        }
                    }
                    this.chessPieces[spp].movedBefore = true;
                    if (epp === -1) {
                        this.chessPieces[spp].row = ep[0];
                        this.chessPieces[spp].col = ep[1];
                    }
                    else if (this.chessPieces[spp].team !== this.chessPieces[epp].team) {
                        this.chessPieces[spp].row = ep[0];
                        this.chessPieces[spp].col = ep[1];
                        this.chessPieces[epp].row = 9;
                        if (this.takenPieces > 15) {
                            this.chessPieces[epp].row = 10;
                        }
                        this.chessPieces[epp].col = 0;
                        this.chessPieces[epp].taken = this.takenPieces;
                        this.takenPieces++;
                        this.chessPieces[epp].active = false;
                    }
                    if ((this.chessPieces[spp].type === "p")&&(this.chessPieces[spp].team%2 !== 0)&&(this.chessPieces[spp].col === 0)) {
                        this.chessPieces[spp].type = "q";
                        this.chessPieces[spp].changePic();
                    }
                    else if ((this.chessPieces[spp].type === "p")&&(this.chessPieces[spp].team%2 === 0)&&(this.chessPieces[spp].col === 7)) {
                        this.chessPieces[spp].type = "q";
                        this.chessPieces[spp].changePic();
                    }
                    if ((this.chessPieces[spp].type === "c")&&(this.chessPieces[spp].team%2 !== 0)&&(this.chessPieces[spp].col === 0)) {
                        this.chessPieces[spp].type = "cc";
                        this.chessPieces[spp].changePic();
                    }
                    else if ((this.chessPieces[spp].type === "cc")&&(this.chessPieces[spp].team%2 === 0)&&(this.chessPieces[spp].col === 7)) {
                        this.chessPieces[spp].type = "cc";
                        this.chessPieces[spp].changePic();
                    }
                }
                this.winCheck();
            }
        }
    }
    validSpot(row, col){
        if ((row >= 0)&&(row < this.rows)){
            if ((col >= 0)&&(col < this.columns)) {
                return true;
            }
        }
        return false;
    }
    validMove(piece, ep) {
        var colcheck = 0;
        var rowcheck = 0;
        var colcheck = piece.col - ep[1];
        var rowcheck = piece.row - ep[0];
        if (piece.type === "p") {
            if (piece.team%2 === 0) { colcheck = colcheck*-1; }
            if ((piece.movedBefore === false)&&(colcheck === 2)&&(rowcheck === 0)) {
                if (!this.occupied(ep)) {
                    return true;
                }
            }
            if ((colcheck === 1)&&(rowcheck === 0)) {
                if (!this.occupied(ep)) {
                    return true;
                }
            }
            else if ((colcheck === 1)&&(Math.abs(rowcheck) === 1)) {
                if (this.occupied(ep)) {
                    if (piece.team != this.teamcheck(ep)) {
                        return true;
                    }
                }
            }
        }
        else if (piece.type === "b"){
            if (Math.abs(colcheck) === Math.abs(rowcheck)) {
                if (piece.team != this.teamcheck(ep)) {
                    return true;
                }
            }
        }
        else if (piece.type === "r"){
            if ((colcheck === 0)||(rowcheck === 0)) {
                if (piece.team != this.teamcheck(ep)) {
                    return true;
                }
            }
        }
        else if (piece.type === "q"){
            if ((colcheck === 0)||(rowcheck === 0)) {
                if (piece.team != this.teamcheck(ep)) {
                    return true;
                }
            }
            else if (Math.abs(colcheck) === Math.abs(rowcheck)) {
                if (piece.team != this.teamcheck(ep)) {
                    return true;
                }
            }
        }
        else if (piece.type === "h"){
            if ((Math.abs(colcheck) === 1)&&(Math.abs(rowcheck) === 2)) {
                if (piece.team != this.teamcheck(ep)) {
                    return true;
                }
            }
            if ((Math.abs(colcheck) === 2)&&(Math.abs(rowcheck) === 1)) {
                if (piece.team != this.teamcheck(ep)) {
                    return true;
                }
            }
        }
        else if (piece.type === "k"){
            if ((Math.abs(colcheck) <= 1)&&(Math.abs(rowcheck) <= 1)) {
                if (piece.team != this.teamcheck(ep)) {
                    return true;
                }
            }
        }
        else if (piece.type === "c") {
            if ((Math.abs(colcheck) <= 2)&&(Math.abs(rowcheck) <= 2)&&(Math.abs(colcheck) === Math.abs(rowcheck))) {
                if (Math.abs(colcheck) === 1) {
                    if (!this.occupied(ep)){
                        if ((piece.team%2 === 0)&&(colcheck < 0)) { return true; }
                        if ((piece.team%2 !== 0)&&(colcheck > 0)) { return true; }
                    }
                }
                else {
                    var tempcolcheck = colcheck/2;
                    var temprowcheck = rowcheck/2;
                    var tempep = [];
                    tempep[0] = ep[0];
                    tempep[1] = ep[1];
                    tempep[0] += temprowcheck;
                    tempep[1] += tempcolcheck;
                    if (this.occupied(tempep)&&(!this.occupied(ep))) {
                        if (piece.team != this.teamcheck(tempep)) {
                            return true;
                        }
                    }
                }
            }
        }
        else if (piece.type === "cc") {
            if ((Math.abs(colcheck) <= 2)&&(Math.abs(rowcheck) <= 2)&&(Math.abs(colcheck) === Math.abs(rowcheck))) {
                if (Math.abs(colcheck) === 1) {
                    if (!this.occupied(ep)){
                        return true;
                    }
                }
                else {
                    tempcolcheck = colcheck/2;
                    temprowcheck = rowcheck/2;
                    tempep = ep;
                    tempep[0] += temprowcheck;
                    tempep[1] += tempcolcheck;
                    if (this.occupied(tempep)&&(!this.occupied(ep))) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
    occupied(ep) {
        for (i = 0; i < this.chessPieces.length; i++) {
            if ((this.chessPieces[i].row === ep[0])&&(this.chessPieces[i].col === ep[1])) {
                return true;
            }
        }
        return false;
    }
    teamcheck(ep){
        for (i = 0; i < this.chessPieces.length; i++) {
            if ((this.chessPieces[i].row === ep[0])&&(this.chessPieces[i].col === ep[1])) {
                return this.chessPieces[i].team;
            }
        }
        return "nothing";
    }
}


function letterToNumber(letter){
    var letters = ["h", "g", "f", "e", "d", "c", "b", "a"];
    var numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];
    for (i = 0; i < letters.length; i++) {
        if (letters[i] === letter) {
            return i;
        }
        else if (numbers[i] === letter) {
            return i;
        }
    }
    return -1;
}

class ChessPiece {
    constructor(row, col, type, team) {
        var _this = this;
        this.type = type;
        this.movedBefore = false;
        this.col = col;
        this.row = row;
        this.team = team;
        this.active = true;
        this.taken = 0;
        this.hue = team*50+100;
        this.changePic();
        this.x = this.col * tileSize + tops;
        this.y = this.row * tileSize + lefts;
    }
    changePic(){
        var _this = this;
        this.visible = false;
        this.image = new Image();
        this.image.src = "Chess/"+this.type+this.team+".png";
        this.image.onload = function() {
            _this.visible = true;
        }
    }
    draw() {
        if (this.visible) {
            var ctx = myGameArea.context;
	    	ctx.imageSmoothingEnabled = false;
		    ctx.webkitImageSmoothingEnabled = false;
    		ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.save();
            /*if (this.team === "1") {
                this.hue++;
            }*/
            //ctx.filter = 'hue-rotate('+this.hue+'deg) brightness(3)';
            var xposition = this.col*tileSize+tops;
            var yposition = this.row*tileSize+lefts;
            if (this.row == 8) {
                xposition = this.taken*(tileSize/3)+tops;
            }

            if (this.x !== xposition) {
                if (this.x < xposition) { this.x += (xposition-this.x)*0.04; }
                else { this.x -= (this.x-xposition)*0.04; }
                if (Math.abs(this.x - xposition) < 1) { this.x = xposition; }
            }
            if (this.y !== yposition) {
                if (this.y < yposition) { this.y += (yposition-this.y)*0.04; }
                else { this.y -= (this.y-yposition)*0.04; }
                if (Math.abs(this.y - yposition) < 1) { this.y = yposition; }
            }
            //if (this.y !== (this.col * tileSize + lefts)) { this.y += (this.y - ((this.col * tileSize + lefts)*0.2)); }
            ctx.drawImage(this.image,this.y,this.x-2, tileSize, tileSize);
            ctx.restore();
        }
    }
    update(){
        this.draw();
    }

}