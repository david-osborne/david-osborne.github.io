var gbl_canvasWidth = window.innerWidth, gbl_canvasHeight = window.innerHeight, cvs, ctx, secondsPassed, oldTimeStamp, fps = 0, gbl_particleCount = 0, gbl_timestampStart, gbl_listX = [], // x pos
gbl_listY = [], // y pos
gbl_listR = [], // radius
gbl_listC = [], // color
gbl_listA = [], // angle
gbl_listT = []; // type
window.onload = init;
function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');
    //scaleCanvas();
    var startTime = new Date;
    gbl_timestampStart = startTime;
    createEventListeners();
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
function createEventListeners() {
    window.addEventListener('resize', windowSize);
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
    generateArrays();
    draw();
    drawText(fps);
    iterateArrays();
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
    ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
    //ctx.fillStyle = 'black';
    //ctx.fillRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}
function generateArrays() {
    var randomColor = '#' + Math.random().toString(16).substr(2, 6);
    gbl_listC.push(randomColor);
    gbl_listA.push(randomInt(0, 360));
    gbl_listX.push(randomInt(0, gbl_canvasWidth));
    gbl_listY.push(10);
    gbl_listR.push(randomInt(2, 4));
}
function iterateArrays() {
    for (var index = 0; index < gbl_listY.length; index++) {
        var element = gbl_listY[index];
        if (element < gbl_canvasHeight) {
            gbl_listY[index] = element + 1;
        }
    }
}
function cleanArrays() {
    for (var i = 0; i < gbl_listX.length; i++) {
        if (gbl_listY[i] >= gbl_canvasHeight - gbl_listR[i]
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
        //set fill color
        ctx.fillStyle = 'white';
        //draw filled circle
        ctx.beginPath();
        ctx.arc(gbl_listX[i], gbl_listY[i], gbl_listR[i], 0, 360);
        ctx.stroke();
        ctx.fill();
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