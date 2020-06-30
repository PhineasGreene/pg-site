
var canvasS=document.getElementById("SwarmCanvas");
var ctxS=canvasS.getContext("2d");

var WIDTH = ctxS.canvas.clientWidth;
var HEIGHT = ctxS.canvas.clientHeight;

var mouseS={x:0, y:0};

function getMousePosS(canvas, evt) {
	var rect = canvasS.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

window.addEventListener('mousemove', function(evt) {
	mouseS = getMousePosS(canvasS, evt);
}, false);

var Fish=function(){
	this.x=Math.random()*WIDTH;
	this.y=Math.random()*HEIGHT;
	this.xs=(Math.random()-0.5)*3;
	this.ys=(Math.random()-0.5)*3;
	this.xa=0;
	this.ya=0;
	this.color=Math.round(Math.random()*6);
};

Fish.prototype.draw=function(){
	ctxS.beginPath();
	ctxS.arc(this.x, this.y, 1, 0, 2 * Math.PI);
	ctxS.fillStyle = colors[this.color%6];
	ctxS.fill();
};

Fish.prototype.applyForce=function(x, y){
	this.xa+=x;
	this.ya+=y;
};

Fish.prototype.update=function(arr){
	var d=5;
	if(Math.abs(this.xs) > 7 || Math.abs(this.ys) > 7){
		d=4;
	}
	if(Math.abs(this.xs) > 15 || Math.abs(this.ys) > 15){
		d=2;
	}
	this.applyForce(-this.xs/d, -this.ys/d);


	this.x+=this.xs;
	this.y+=this.ys;
	this.xs+=this.xa;
	this.ys+=this.ya ;
	this.xa=0;
	this.ya=0;

	var otherSpeedSum={x:0, y:0};
	var otherPosSum={x:0, y:0};
	var num=0;
	for(var i=0; i<arr.length; i++){
		var a = arr[i].x - this.x;
		var b = arr[i].y - this.y;
		var c = Math.abs( a*a + b*b );
		if(c < 70*70 && c !== 0){
			if(c < 3*3){
				this.applyForce(a*(-c)/5, b*(-c)/5);
			}
			otherPosSum.x+=arr[i].x;
			otherPosSum.y+=arr[i].y;
			otherSpeedSum.x+=arr[i].xs;
			otherSpeedSum.y+=arr[i].ys;
			num++;
		}
	}
	if(num>0){
		this.applyForce(otherSpeedSum.x/num/4.5, otherSpeedSum.y/num/4.5);
		this.applyForce((otherPosSum.x/num-this.x)/70, (otherPosSum.y/num-this.y)/70);
	}

	var a = mouseS.x - this.x;
	var b = mouseS.y - this.y;
	var c = Math.abs( a*a + b*b );
	if(c < 60*60 && c > 1){
		this.applyForce(-a/40, -b/40);
	}
};

Fish.prototype.overlap=function(){
	if(this.x > WIDTH){
		this.x=0;
	}else if(this.x < 0){
		this.x=WIDTH;
	}

	if(this.y > HEIGHT){
		this.y=0;
	}else if(this.y < 0){
		this.y=HEIGHT;
	}
};

var fish=[];

for(var i=0; i<10000; i++){
	fish.push(new Fish());
}

setInterval(
	function(){
		if(mouseS.x >= 0 && mouseS.x <= WIDTH && mouseS.y <= HEIGHT && mouseS.y >= 0){
			ctxS.fillStyle="black";
			ctxS.fillRect(0, 0, WIDTH, HEIGHT);

			for(var i=0; i<fish.length; i++){
				fish[i].draw();
				fish[i].update(fish);
				fish[i].overlap();

			}
		}
	},
	30

);