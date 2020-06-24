
var canvasf=document.getElementById("FlingCanvas");
var ctx=canvasf.getContext("2d");

var WIDTH = ctx.canvas.clientWidth;
var HEIGHT = ctx.canvas.clientHeight;

var colors=["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

var Dot=function(){
	this.x=Math.random()*WIDTH;
	this.y=Math.random()*HEIGHT;
	this.xs=0;
	this.ys=0;
	this.xa=0;
	this.ya=0;
	this.color=colors[Math.round(Math.random()*6)];
	this.mass=Math.random()+1;
};

Dot.prototype.draw=function(){
	ctx.beginPath();
	ctx.arc(this.x, this.y, Math.max(1, Math.max(Math.abs(this.xs), Math.abs(this.ys))/(20/this.mass)), 0, 2 * Math.PI);
	ctx.fillStyle = this.color;
	ctx.fill();
};

Dot.prototype.applyForce=function(x, y){
	this.xa+=x/this.mass;
	this.ya+=y/this.mass;
};

Dot.prototype.update=function(){
	this.x+=this.xs;
	this.y+=this.ys;
	this.xs+=this.xa;
	this.ys+=this.ya ;
	this.xa=0;
	this.ya=0;
};

var dots=[];

for(var i=0; i<300; i++){
	dots[i]=new Dot();
}

var mouse={x:0, y:0};
var last={x:0, y:0};

function getMousePos(canvas, evt) {
	var rect = canvasf.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

window.addEventListener('mousemove', function(evt) {
	mouse = getMousePos(canvasf, evt);
}, false);

setInterval(function (){
	if(mouse.x >= 0 && mouse.x <= WIDTH && mouse.y <= HEIGHT && mouse.y >= 0){
		ctx.fillStyle="black";
		ctx.globalAlpha=0.6;
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.globalAlpha=1;

		for(var i=0; i<dots.length; i++){
			dots[i].draw();
			dots[i].update();
			dots[i].applyForce((last.x-mouse.x)/-10, (last.y-mouse.y)/-10);
			let x=mouse.x-dots[i].x;
			let y=mouse.y-dots[i].y;
			dots[i].applyForce(x/100, y/100);
			dots[i].applyForce(dots[i].xs*-0.05, dots[i].ys*-0.05);
			dots[i].applyForce((Math.random()-0.5)*3, (Math.random()-0.5)*3)
		}

		last=mouse;
	}
}, 30);