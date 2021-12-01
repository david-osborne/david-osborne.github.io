let gbl_canvasWidth = window.innerWidth;
let gbl_canvasHeight = window.innerHeight;
let cvs;
let ctx;
let secondsPassed;
let oldTimeStamp;
let fps = 0;
let gbl_imagePosX: number = gbl_canvasWidth / 2;
let gbl_imagePosY: number = gbl_canvasHeight / 2;
let gbl_imageDir: string = '';
let gbl_mouseDown: boolean = false;
let gbl_mouseX = 0;
let gbl_mouseY = 0;
let gbl_particleCount = 0;
let gbl_timestampStart: Date;
let gbl_listX: number[] = []; // x pos
let gbl_listY: number[] = []; // y pos
let gbl_listR: number[] = []; // radius
let gbl_listC: string[] = []; // color
let gbl_listA: number[] = []; // angle
let gbl_listT: number[] = []; // type
let gbl_lastKeyDown;
let gbl_rectAngle: number = 0;

window.onload = init;

function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');

    const startTime = new Date;
    gbl_timestampStart = startTime;

    cvs.addEventListener('mousemove', mouseMove);
    cvs.addEventListener('mousedown', mouseDown);
    cvs.addEventListener('mouseup', mouseUp);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

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

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function generateCanvas() {
    const body = document.getElementById('body');
    const canvas = document.createElement('canvas');
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
    let imgBart = new Image();
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
    for (let i = 0; i < gbl_listX.length; i++) {
        gbl_listY[i] = gbl_listY[i] + 1;
        //if item exists outside the canvas, remove it from the array
        if (
            gbl_listY[i] > gbl_canvasHeight + gbl_listR[i]
            ||
            gbl_listX[i] > gbl_canvasWidth + gbl_listR[i]
        ) {
            gbl_listC.splice(i, 1);
            gbl_listX.splice(i, 1);
            gbl_listY.splice(i, 1);
            gbl_listR.splice(i, 1);
            gbl_listA.splice(i, 1);
            gbl_listT.splice(i, 1);
        }
    }

    //generate randoms
    let randomColor = '#' + Math.random().toString(16).substr(2, 6);
    let randomX = randomInt(0, gbl_canvasWidth);
    let randomY = randomInt(0, -40);
    let randomR = randomInt(2, 10);
    let randomA = randomInt(0, 360);
    let randomT = randomInt(1, 2);

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
    for (let i = 0; i < gbl_listX.length; i++) {
        ctx.fillStyle = gbl_listC[i];

        console.log(gbl_listT[i].toString());

        if (gbl_listT[i] == 1) //circle
        {
            ctx.beginPath();
            ctx.arc(gbl_listX[i], gbl_listY[i], gbl_listR[i], 0, 360);
            //ctx.arc(randomX, randomY, randomR, 0, 360);
            ctx.fill()
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

function drawText(fps: number) {
    const d = new Date();
    let hh = d.getHours().toString();
    let mm = d.getMinutes().toString();
    let ss = d.getSeconds().toString();
    let ms = d.getMilliseconds().toString();

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 280, 150);

    ctx.font = '24px Courier New';
    ctx.fillStyle = 'orange';
    ctx.fillText('FPS: ' + fps, 10, 22);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('Timestamp: ' + hh + ':' + mm + ':' + ss + '.' + ms, 10, 40);
    ctx.fillText('Mouse X: ' + gbl_mouseX.toString() + ' / Mouse Y: ' + gbl_mouseY.toString(), 10, 60);
    ctx.fillText('Particle count: ' + gbl_listX.length.toString(), 10, 80);
    ctx.fillText('Elapsed time: ' + timeDiff().toString(), 10, 100);
    ctx.fillText('Mouse Down: ' + gbl_mouseDown, 10, 120);
    ctx.fillText('Window size: ' + gbl_canvasWidth + 'W x ' + gbl_canvasHeight + 'H', 10, 140);
}

function drawCrosshairs() {
    let x = gbl_mouseX;
    let y = gbl_mouseY;

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