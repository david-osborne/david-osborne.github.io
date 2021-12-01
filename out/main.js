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
    var startTime = new Date;
    gbl_timestampStart = startTime;
    cvs.addEventListener('mousemove', mouseMove);
    cvs.addEventListener('mousedown', mouseDown);
    cvs.addEventListener('mouseup', mouseUp);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    cvs.addEventListener('touchstart', mouseDown);
    cvs.addEventListener('touchend', mouseUp);
    cvs.addEventListener('touchmove', touchMove);
    window.addEventListener('resize', windowSize);
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
function windowSize() {
    gbl_canvasWidth = window.innerWidth;
    gbl_canvasHeight = window.innerHeight;
    ctx.canvas.width = gbl_canvasWidth;
    ctx.canvas.height = gbl_canvasHeight;
}
function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    // Update particle count
    gbl_particleCount++;
    clearCanvas();
    //drawRect();
    arrayUpdate();
    draw();
    drawBart();
    drawCrosshairs();
    drawText(fps);
    drawTextExplain();
    drawBartText();
    drawScreenSizeText();
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
function keyDown(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
        gbl_imageDir = 'left';
    }
    if (e.keyCode == 39 || e.keyCode == 68) {
        gbl_imageDir = 'right';
    }
    if (e.keyCode == 38 || e.keyCode == 87) {
        gbl_imageDir = 'up';
    }
    if (e.keyCode == 40 || e.keyCode == 83) {
        gbl_imageDir = 'down';
    }
}
function keyUp(e) {
    gbl_imageDir = '';
}
function drawBart() {
    var imgBart = new Image();
    if (gbl_mouseDown == true) {
        imgBart.src = 'img/bart_dead.png';
    }
    else {
        imgBart.src = 'img/bart.png';
    }
    if (gbl_imageDir == 'left') {
        if (gbl_imagePosX > 4) {
            gbl_imagePosX = gbl_imagePosX - 4;
        }
    }
    if (gbl_imageDir == 'right') {
        if (gbl_imagePosX < gbl_canvasWidth - (imgBart.width + 4)) {
            gbl_imagePosX = gbl_imagePosX + 4;
        }
    }
    if (gbl_imageDir == 'up') {
        if (gbl_imagePosY > 4) {
            gbl_imagePosY = gbl_imagePosY - 4;
        }
    }
    if (gbl_imageDir == 'down') {
        if (gbl_imagePosY < (gbl_canvasHeight - imgBart.height) - 4) {
            gbl_imagePosY = gbl_imagePosY + 4;
        }
    }
    ctx.drawImage(imgBart, gbl_imagePosX, gbl_imagePosY);
}
function clearCanvas() {
    //clear canvas
    //ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
    ctx.fillStyle = 'azure';
    ctx.fillRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}
function arrayUpdate() {
    //increment all items down 1px
    for (var i = 0; i < gbl_listX.length; i++) {
        gbl_listY[i] = gbl_listY[i] + 1;
        //if item exists outside the canvas, remove it from the array
        if (gbl_listY[i] > gbl_canvasHeight + gbl_listR[i]
            ||
                gbl_listX[i] > gbl_canvasWidth + gbl_listR[i]) {
            gbl_listC.splice(i, 1);
            gbl_listX.splice(i, 1);
            gbl_listY.splice(i, 1);
            gbl_listR.splice(i, 1);
            gbl_listA.splice(i, 1);
            gbl_listT.splice(i, 1);
        }
    }
    //generate randoms
    var randomColor = '#' + Math.random().toString(16).substr(2, 6);
    var randomX = randomInt(0, gbl_canvasWidth);
    var randomY = randomInt(0, -40);
    var randomR = randomInt(2, 10);
    var randomA = randomInt(0, 360);
    var randomT = randomInt(1, 2);
    //append new array items
    gbl_listC.push(randomColor);
    gbl_listX.push(randomX);
    gbl_listY.push(randomY);
    gbl_listR.push(randomR);
    gbl_listA.push(randomA);
    gbl_listT.push(randomT);
}
function draw() {
    //draw particle for each array item
    for (var i = 0; i < gbl_listX.length; i++) {
        ctx.fillStyle = gbl_listC[i];
        if (gbl_listT[i] == 1) //circle
         {
            ctx.beginPath();
            ctx.arc(gbl_listX[i], gbl_listY[i], gbl_listR[i], 0, 360);
            //ctx.arc(randomX, randomY, randomR, 0, 360);
            ctx.fill();
        }
        else //rect
         {
            ctx.save();
            ctx.translate(gbl_listX[i], gbl_listY[i]);
            ctx.rotate(gbl_listA[i] * Math.PI / 180);
            ctx.fillRect(gbl_listX[i] / 2, gbl_listY[i] / 2, gbl_listR[i], gbl_listR[i]); //flying
            //ctx.fillRect(-gbl_listR[i] / 2, -gbl_listR[i] / 2, gbl_listR[i], gbl_listR[i]); //rotating
            ctx.restore();
            if (gbl_listA[i] < 360) {
                gbl_listA[i]++;
            }
            else {
                gbl_listA[i] = 0;
            }
        }
    }
}
function drawRect() {
    ctx.save(); //save canvas state
    ctx.fillStyle = 'blue';
    ctx.translate(500, 400);
    ctx.rotate(gbl_rectAngle * Math.PI / 180);
    ctx.fillRect(-50 / 2, -50 / 2, 50, 50);
    ctx.restore(); //restore canvas state
    if (gbl_rectAngle < 360) {
        gbl_rectAngle++;
    }
    else {
        gbl_rectAngle = 0;
    }
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function drawText(fps) {
    var d = new Date();
    var hh = d.getHours().toString();
    var mm = d.getMinutes().toString();
    var ss = d.getSeconds().toString();
    var ms = d.getMilliseconds().toString();
    ctx.fillStyle = 'black';
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
function drawTextExplain() {
    ctx.fillStyle = 'lightgray';
    var left = gbl_canvasWidth - 300;
    var top = gbl_canvasHeight - 90;
    ctx.fillRect(left, top, 300, 90);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('What is this?', left + 10, top + 20);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('a test of various canvas drawing techniques,', left + 10, top + 40);
    ctx.fillText('with the goal of a constant high framerate,', left + 10, top + 60);
    ctx.fillText('using Typescript as the language', left + 10, top + 80);
}
function drawBartText() {
    ctx.fillStyle = 'dodgerblue';
    ctx.fillRect(0, 150, 280, 40);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Move Bart using the arrow keys or WASD', 10, 164);
    ctx.fillText('Left-click mouse button to kill Bart', 10, 184);
}
function drawScreenSizeText() {
    ctx.fillStyle = 'mediumseagreen';
    ctx.fillRect(0, 200, 280, 20);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Try pressing "F11" to enter full screen', 10, 214);
}
function drawCrosshairs() {
    var x = gbl_mouseX;
    var y = gbl_mouseY;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    // draw vert line
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gbl_canvasHeight);
    ctx.stroke();
    ctx.translate(0, 0);
    // draw horz line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gbl_canvasWidth, y);
    ctx.stroke();
    // draw red circle
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 360);
    ctx.stroke();
    if (gbl_mouseDown) {
        ctx.fillStyle = 'red';
        ctx.fill();
    }
}
function mouseMove(e) {
    var rect = cvs.getBoundingClientRect(); //get canvas boundries
    gbl_mouseX = e.clientX - rect.left;
    gbl_mouseY = e.clientY - rect.top;
}
function touchMove(e) {
    //var rect = cvs.getBoundingClientRect(); //get canvas boundries
    gbl_mouseX = e.touches[0].clientX;
    gbl_mouseY = e.touches[0].clientY;
}
function mouseDown(e) {
    gbl_mouseDown = true;
}
function mouseUp(e) {
    gbl_mouseDown = false;
}
function timeDiff() {
    var timeDiff = new Date().getTime() - gbl_timestampStart.getTime();
    timeDiff /= 1000; //strip ms
    return timeDiff;
}
//# sourceMappingURL=main.js.map