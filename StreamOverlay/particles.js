class Particles {
    constructor() {
        this.particleArray = [];
        this.paused = false;
        this.enabled = true;
        //todo: add stuff to make ALL particles circle around point equally, etc, instead of doing one at a time
        //todo: also, regular stuff like synchronized movement or rotation
    }
    add(name){
        if (this.enabled) {
            var templength = this.particleArray.length;
            this.particleArray[templength] = new Particle(name);
        }
    }
    disable(){
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
    }

    update(){
        if (!this.paused) {
            for (var i = 0; i < this.particleArray.length; i++) {
                this.particleArray[i].update();
            }
        }
    }
    pause(){
        this.paused = true;
    }
    start(){
        this.paused = false;
    }
    clear(){
        this.particleArray = [];
    }
    remove(index){
        this.particleArray.splice(index, 1);
    }
}


//todo: rotate around center point via sin/cos and also sway back and forth with sin/cos
//todo: make sure all randomzable params have an array (also make sure randomizable is optional)
class Particle {
    constructor (name) {
        this.resetData = new Object;
        this.name = name;
        this.loadParticle();
    }

    validate() {
        this.resetData.images = (this.resetData.images !== undefined) ? this.resetData.images : ["http://zetaplays.wheelofcrap.com/stuff/duck1.png", "http://zetaplays.wheelofcrap.com/stuff/duck2.png"];
        this.resetData.type = this.resetData.type ? this.resetData.type : "bird";
        this.resetData.x = this.resetData.x ? this.resetData.x : 100;
        this.resetData.y = this.resetData.y ? this.resetData.y : 100;
        this.resetData.width = this.resetData.width ? this.resetData.width : 32;
        this.resetData.height = this.resetData.height ? this.resetData.height : 32;
        this.resetData.animationSpeed = this.resetData.animationSpeed ? this.resetData.animationSpeed : 20;
        this.resetData.xSpawn = (this.resetData.xSpawn !== undefined) ? this.resetData.xSpawn : [100,200];
        this.resetData.ySpawn = (this.resetData.ySpawn !== undefined) ? this.resetData.ySpawn : [100,200];
        this.resetData.xSpeed = (this.resetData.xSpeed !== undefined) ? this.resetData.xSpeed : [1, 3];
        this.resetData.ySpeed = (this.resetData.ySpeed !== undefined) ? this.resetData.ySpeed : [0];
        this.resetData.xScale = (this.resetData.xScale !== undefined) ? this.resetData.xScale : [2];
        this.resetData.yScale = (this.resetData.yScale !== undefined) ? this.resetData.yScale : [2];
        this.resetData.scaleLock = this.resetData.scaleLock ? this.resetData.scaleLock : true;
        this.resetData.gravity = this.resetData.gravity ? this.resetData.gravity : 0;
        this.resetData.wind = this.resetData.wind ? this.resetData.wind : 0;
        this.resetData.xScaleSpeed = this.resetData.xScaleSpeed ? this.resetData.xScaleSpeed : 0
        this.resetData.yScaleSpeed = this.resetData.yScaleSpeed ? this.resetData.yScaleSpeed : 0
        this.resetData.angle = this.resetData.angle ? this.resetData.angle : 0;
        this.resetData.orbit = this.resetData.orbit ? this.resetData.orbit : false;
        this.resetData.radius = this.resetData.radius ? this.resetData.radius : 0;
        this.resetData.angleSpeed = (this.resetData.angleSpeed !== undefined) ? this.resetData.angleSpeed : [0];
        this.resetData.rotation = this.resetData.rotation ? this.resetData.rotation : 0;
        this.resetData.rotationSpeed = this.resetData.rotationSpeed ? this.resetData.rotationSpeed : 0;
        this.resetData.showncount = this.resetData.showncount ? this.resetData.showncount : 0;
        this.resetData.recurring = this.resetData.recurring ? this.resetData.recurring : false;
        this.resetData.offscreen = this.resetData.offscreen ? this.resetData.offscreen : false;
        this.resetData.life = this.resetData.life ? this.resetData.life : -1;
        this.resetData.delay = this.resetData.delay ? this.resetData.delay : 0;
    }

    init() {
        var _this = this;
        this.images = [];
        if (this.resetData.images !== undefined) {
            for (var i = 0; i < this.resetData.images.length; ++i) {
           		this.images[i] = new Image();
                this.images[i].src = this.resetData.images[i];
            }
            this.images[0].onload = function(){
                _this.width = this.width;
                _this.height = this.height;
                _this.ready = true;
            };
        }
        this.type = this.resetData.type;
        this.x = Math.floor(Math.random()*this.resetData.xSpawn[1])+this.resetData.xSpawn[0];
	    this.y = Math.floor(Math.random()*this.resetData.ySpawn[1])+this.resetData.ySpawn[0];
    	this.width = this.resetData.width;
    	this.height = this.resetData.height;
	    this.animationSequence = this.images;
        this.animationFrame = 0;
        this.frameCount = 0;
	    this.animationSpeed = this.resetData.animationSpeed;
    	this.xSpawn = this.resetData.xSpawn;
	    this.ySpawn = this.resetData.ySpawn;
        this.xSpeed = (this.resetData.xSpeed[1] !== undefined) ? (Math.random()*this.resetData.xSpeed[1])+this.resetData.xSpeed[0] : this.resetData.xSpeed[0];
    	this.ySpeed = (this.resetData.ySpeed[1] !== undefined) ? (Math.random()*this.resetData.ySpeed[1])+this.resetData.ySpeed[0] : this.resetData.ySpeed[0];
	    this.xScale = (this.resetData.xScale[1] !== undefined) ? Math.floor(Math.random()*this.resetData.xScale[1])+this.resetData.xScale[0] : this.resetData.xScale[0];
        this.yScale = (this.resetData.yScale[1] !== undefined) ? Math.floor(Math.random()*this.resetData.yScale[1])+this.resetData.yScale[0] : this.resetData.yScale[0];
        this.scaleLock = this.resetData.scaleLock;
        if (this.scaleLock === true) {
            this.yScale = this.xScale;
        }
        this.gravity = this.resetData.gravity;
        this.gravityAccel = 0;
        this.wind = this.resetData.wind;
        this.windAccel = 0;
        this.angle = this.resetData.angle;
        this.angleSpeed = (this.resetData.angleSpeed[1] !== undefined) ? Math.floor(Math.random()*this.resetData.angleSpeed[1])+this.resetData.angleSpeed[0] : this.resetData.angleSpeed[0];
        this.orbit = this.resetData.orbit;
        this.radius = this.resetData.radius;
        this.wiggle = this.resetData.wiggle;
	    this.xScaleSpeed = this.resetData.xScaleSpeed;
    	this.yScaleSpeed = this.resetData.yScaleSpeed;
        this.rotation = this.resetData.rotation;
    	this.shown = false;
	    this.showncount = this.resetData.showncount;
	    this.rotationSpeed = this.resetData.rotationSpeed;
    	this.recurring = this.resetData.recurring;
        this.offscreen = this.resetData.offscreen;
        this.life = this.resetData.life;
        this.delay = this.resetData.delay;
        this.alive = true;
        this.ready = false;
    }

    reset() {
    	this.x = this.resetData.x;
	    this.y = this.resetData.y;
    	this.width = this.resetData.width;
    	this.height = this.resetData.height;
        this.animationFrame = 0;
        this.frameCount = 0;
        this.xSpeed = (this.resetData.xSpeed[1] !== undefined) ? (Math.random()*this.resetData.xSpeed[1])+this.resetData.xSpeed[0].toFixed(2) : this.resetData.xSpeed[0];
    	this.ySpeed = (this.resetData.ySpeed[1] !== undefined) ? (Math.random()*this.resetData.ySpeed[1])+this.resetData.ySpeed[0].toFixed(2) : this.resetData.ySpeed[0];
	    this.xScale = (this.resetData.xScale[1] !== undefined) ? (Math.random()*this.resetData.xScale[1])+this.resetData.xScale[0].toFixed(2) : this.resetData.xScale[0];
        this.yScale = (this.resetData.yScale[1] !== undefined) ? (Math.random()*this.resetData.yScale[1])+this.resetData.yScale[0].toFixed(2) : this.resetData.yScale[0];
        this.scaleLock = this.resetData.scaleLock;
        if (this.scaleLock === true) {
            this.yScale = this.xScale;
        }
        this.gravity = this.resetData.gravity;
        this.gravityAccel = 0;
        this.wind = this.resetData.wind;
        this.windAccel = 0;
        this.angle = this.resetData.angle;
        this.angleSpeed = (this.resetData.angleSpeed[1] !== undefined) ? Math.floor(Math.random()*this.resetData.angleSpeed[1])+this.resetData.angleSpeed[0] : this.resetData.angleSpeed[0];
        this.orbit = this.resetData.orbit;
        this.radius = this.resetData.radius;
        this.wiggle = this.resetData.wiggle;
        this.rotation = this.resetData.rotation;
    	this.shown = false;
	    this.showncount = this.resetData.showncount;
    	this.recurring = this.resetData.recurring;
        this.offscreen = this.resetData.offscreen;
        this.life = this.resetData.life;
        this.delay = this.resetData.delay;
        this.alive = true;
    }
    respawn(){
    	this.reset();
	    this.x = Math.floor(Math.random()*this.xSpawn[1])+this.xSpawn[0];
	    this.y = Math.floor(Math.random()*this.ySpawn[1])+this.ySpawn[0];
    }
    animate(){
        this.frameCount++;
        if (this.frameCount%this.animationSpeed === 0) {
           this.animationFrame++;
           if (this.animationFrame >= this.images.length) {
              this.animationFrame = 0;
           }
        }
    }
    draw(){
        var ctx = myGameArea.context;
		ctx.imageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.save();
        if ((this.life < 20)&&(this.life > 0)) {
        	ctx.globalAlpha = this.life*0.03;
        }
        this.xScale+=this.xScaleSpeed;
        this.yScale+=this.yScaleSpeed;
        ctx.scale(this.xScale,this.yScale)
	ctx.translate(this.x/this.xScale,this.y/this.yScale);
	ctx.rotate(this.rotation*Math.PI/180);
	ctx.drawImage(this.images[this.animationFrame],-this.width/2,-this.height/2);
        ctx.restore();
    }
    offscreenCheck() {
    	if (this.shown === true) {
	        	if ((this.x < -300)||(this.x > 1500)||(this.y < -300)||(this.y > 1000)) {
		        if (this.recurring) {
	            		this.respawn();
	                }
    	            else {
	                	this.alive = false;
	                }
	    	    }
    	}
	    else {
    		if ((this.x > 0)&&(this.x < 1280)) {
	    		if ((this.y > 0)&&(this.y < 720)) {
		    		this.shown = true;
			    }
    		}
	    	else {
		    	this.showncount++;
			    if (this.showncount > 500) {
		                if (this.recurring) {
    	        		this.respawn();
	    	            }
		                else {
		                	this.alive = false;
		                }
    			}
	    	}
    	}
    }
    movement() {
        this.windAccel += this.wind;
        this.gravityAccel += this.gravity;
    	if ((this.angleSpeed > 0)&&(this.orbit !== true)) {
            var tempangle = (this.angle * Math.PI)/180
	        this.x += this.angleSpeed * Math.sin(tempangle);
	        this.y -= this.angleSpeed * Math.cos(tempangle);
        }
        else if (this.orbit === true){
            var tempangle = (this.angle * Math.PI)/180
            this.x += this.radius * Math.sin(tempangle);
            this.y -= this.radius * Math.cos(tempangle);
            this.angle += this.angleSpeed;
        }
        else {
	        this.x += this.xSpeed + this.windAccel;
	        this.y += this.ySpeed + this.gravityAccel;
		}
        this.rotation += this.rotationSpeed;
    }
    update(){
        if (this.ready) {
        	if(this.alive){
                if(this.delay == 0) {
                	if (this.life > 0) { this.life--; }
                    if (this.life === 0) {
                      if (this.recurring) {
                        this.respawn();
                      }
                    }
                    this.animate();
                    this.movement();
                    this.offscreenCheck();
                    this.draw();
            	}
                else {
            	    this.delay--;
                }
            }
        }
    }

    loadParticle(){
        var _this = this;
        $.getJSON(this.name+".txt", function( data ) {
            _this.resetData = JSON.parse(JSON.stringify(data));
        })
        .always(function(){
            _this.validate();
            _this.init();
        })
        ;
    }
}