var gbl_canvasWidth = window.innerWidth;
var gbl_canvasHeight = window.innerHeight;
var cvs;
var ctx;
var secondsPassed;
var oldTimeStamp;
var fps = 0;
var gbl_imagePosX = gbl_canvasWidth / 2;
var gbl_imagePosY = gbl_canvasHeight / 2;
var gbl_imageDir = '';
var gbl_mouseDown = false;
var gbl_mouseX = 0;
var gbl_mouseY = 0;
var gbl_particleCount = 0;
var gbl_timestampStart;
var gbl_listX = []; // x pos
var gbl_listY = []; // y pos
var gbl_listR = []; // radius
var gbl_listC = []; // color
var gbl_listA = []; // angle
var gbl_listT = []; // type
var gbl_lastKeyDown;
var gbl_rectAngle = 0;
window.onload = init;
function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');
    //scaleCanvas();
    var startTime = new Date;
    gbl_timestampStart = startTime;
    createEventListeners();
    setInterval(timerGenerateTick, 300);
    setInterval(timerShrinkTick, 200);
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
function createEventListeners() {
    window.addEventListener('resize', windowSize);
    cvs.addEventListener('mousedown', mouseDown);
}
function mouseDown(e) {
    var rect = cvs.getBoundingClientRect(); //get canvas boundries
    gbl_mouseX = e.clientX - rect.left;
    gbl_mouseY = e.clientY - rect.top;
    generateArrays(e.clientX, e.clientY);
}
function scaleCanvas() {
    var scaleFactor = backingScale(ctx);
    if (scaleFactor > 1) {
        ctx.canvas.width = ctx.canvas.width * scaleFactor;
        ctx.canvas.height = ctx.canvas.height * scaleFactor;
        // update the context for the new canvas scale
        ctx = cvs.getContext("2d");
    }
}
function windowSize() {
    gbl_canvasWidth = window.innerWidth;
    gbl_canvasHeight = window.innerHeight;
    //scaleCanvas();
    ctx.canvas.width = gbl_canvasWidth;
    ctx.canvas.height = gbl_canvasHeight;
    gbl_listX = [];
    gbl_listY = [];
    gbl_listA = [];
    gbl_listR = [];
    gbl_listC = [];
}
function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}
function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    clearCanvas();
    draw();
    drawText(fps);
    cleanArrays();
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}
function generateCanvas() {
    var body = document.getElementById('body');
    var canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = gbl_canvasWidth;
    canvas.height = gbl_canvasHeight;
    body.appendChild(canvas);
}
function clearCanvas() {
    //clear canvas
    //ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}
function generateArrays(x, y) {
    var randomColor = '#' + Math.random().toString(16).substr(2, 6);
    for (var i = 0; i < randomInt(40, 100); i++) {
        gbl_listC.push(randomColor);
        gbl_listA.push(randomInt(0, 360));
        gbl_listX.push(x);
        gbl_listY.push(y);
        gbl_listR.push(randomInt(12, 20));
    }
}
function timerGenerateTick() {
    generateArrays(randomInt(0, gbl_canvasWidth), randomInt(0, gbl_canvasHeight));
}
function timerShrinkTick() {
    for (var i = 0; i < gbl_listR.length; i++) {
        if (gbl_listR[i] >= 2)
            gbl_listR[i]--;
    }
}
function cleanArrays() {
    for (var i = 0; i < gbl_listX.length; i++) {
        if (gbl_listY[i] > gbl_canvasHeight + gbl_listR[i]
            ||
                gbl_listY[i] < 0 + gbl_listR[i]
            ||
                gbl_listX[i] > gbl_canvasWidth + gbl_listR[i]
            ||
                gbl_listX[i] < 0 + gbl_listR[i]
            ||
                gbl_listR[i] == 1) {
            gbl_listX.splice(i, 1);
            gbl_listY.splice(i, 1);
            gbl_listR.splice(i, 1);
            gbl_listA.splice(i, 1);
            gbl_listC.splice(i, 1);
        }
    }
}
function draw() {
    //draw particle for each array item
    for (var i = 0; i < gbl_listX.length; i++) {
        if (gbl_listR[i] >= 1) {
            //set fill color
            ctx.fillStyle = gbl_listC[i];
            //move points along angle path
            gbl_listX[i] += Math.cos(gbl_listA[i]);
            gbl_listY[i] += Math.sin(gbl_listA[i]);
            //draw filled circle
            ctx.beginPath();
            ctx.arc(gbl_listX[i], gbl_listY[i], gbl_listR[i], 0, 360);
            ctx.stroke();
            ctx.fill();
        }
    }
}
function drawText(fps) {
    var d = new Date();
    var hh = d.getHours().toString();
    var mm = d.getMinutes().toString();
    var ss = d.getSeconds().toString();
    var ms = d.getMilliseconds().toString();
    ctx.fillStyle = 'dimgray';
    ctx.fillRect(0, 0, 280, 130);
    ctx.font = '24px Courier New';
    ctx.fillStyle = 'orange';
    ctx.fillText('FPS: ' + fps, 10, 22);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('Timestamp: ' + hh + ':' + mm + ':' + ss + '.' + ms, 10, 40);
    ctx.fillText('Mouse X: ' + gbl_mouseX.toString() + ' / Mouse Y: ' + gbl_mouseY.toString(), 10, 60);
    ctx.fillText('Particle count: ' + gbl_listX.length.toString(), 10, 80);
    ctx.fillText('Elapsed time: ' + timeDiff().toString(), 10, 100);
    ctx.fillText('Window size: ' + gbl_canvasWidth + 'W x ' + gbl_canvasHeight + 'H', 10, 120);
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function timeDiff() {
    var timeDiff = new Date().getTime() - gbl_timestampStart.getTime();
    timeDiff /= 1000; //strip ms
    return timeDiff;
}
//# sourceMappingURL=main.js.map