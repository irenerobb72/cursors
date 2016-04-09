window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  window.oRequestAnimationFrame      ||
		  window.msRequestAnimationFrame     ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

// Initialize the canvas first with 2d context like
// we always do.
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),

	// Now get the height and width of window so that
	// it works on every resolution. Yes! on mobiles too.
	W = window.innerWidth,
	H = window.innerHeight;

// Set the canvas to occupy FULL space. We want our creation
// to rule, don't we?
canvas.width = W;
canvas.height = H;

canvas.addEventListener("mousemove",mouseXY, false);
canvas.addEventListener("touchstart", touchDown, false);
canvas.addEventListener("touchmove", touchXY, true);
canvas.addEventListener("touchend", touchUp, false);


// Some variables for later use
var circles = [],
	circlesCount = 500,
	mouse = {},
	mouseIsDown = 0;

// Every basic and common thing is done. Now we'll create
// a function which will paint the canvas black.
function paintCanvas() {

	// Default fillStyle is also black but specifying it
	// won't hurt anyone and we can change it back later.
	// If you want more controle over colors, then declare
	// them in a variable.
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}

// This will act as a class which we will use to create
// circle objects. Also, remember that class names are
// generally started with a CAPITAL letter and are
// singular
function Circle() {
	this.x = Math.random() * W;
	this.y = Math.random() * H;

	this.radius = 20;

	this.r = Math.floor(Math.random() * 255);
	this.g = Math.floor(Math.random() * 255);
	this.b = Math.floor(Math.random() * 255);

	this.color = "rgb("+ this.r +", "+ this.g +", "+ this.b +")";

	this.draw = function() {
		ctx.globalCompositeOperation = "lighter";
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();
	}
}

// Insert a random circle to the circles array.
for(var i = 0; i < circlesCount; i++) {
	circles.push(new Circle());
}

// A function that will be called in the loop, so
// consider it as the `main` function
function draw() {
	paintCanvas();

	for(i = 0; i < circles.length; i++) {
		var c1 = circles[i],
			c2 = circles[i-1];

		circles[circles.length - 1].draw();

		if(mouse.x && mouse.y) {
			circles[circles.length - 1].x = mouse.x;
			circles[circles.length - 1].y = mouse.y;
 			c1.draw();
		}

		if(i > 0) {
			c2.x += (c1.x - c2.x) * 0.6;
			c2.y += (c1.y - c2.y) * 0.6;
		}
	}
}

function mouseUp() {
    mouseIsDown = 0;
    mouseXY();
}

function touchUp() {
    mouseIsDown = 0;
}

function mouseDown() {
    mouseIsDown = 1;
    mouseXY();
}

function touchDown() {
    mouseIsDown = 1;
    touchXY();
}

function mouseXY(e) {
    e.preventDefault();
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}

function touchXY(e) {
    e.preventDefault();
    mouse.x = e.targetTouches[0].pageX - canvas.offsetLeft;
    mouse.y = e.targetTouches[0].pageY - canvas.offsetTop;
}

// The loop
function animloop() {
	draw();
	requestAnimFrame(animloop);
}

animloop();
