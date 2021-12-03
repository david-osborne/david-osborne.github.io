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

    //scaleCanvas();

    const startTime = new Date;
    gbl_timestampStart = startTime;

    createEventListeners();

    generateArrays();

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
        ctx.canvas.height = ctx.canvas.height * scaleFactor
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

function clearCanvas() {
    //clear canvas
    //ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
    ctx.globalAlpha = 1.0;
}

function generateArrays() {
    /*
        for (let i = 0; i < 1000; i++) {
            gbl_listA[i] = randomInt(0, 360);
            gbl_listX[i] = gbl_canvasWidth / 2;
            gbl_listY[i] = gbl_canvasHeight / 2;
            gbl_listR[i] = randomInt(1,3);
        }
    */
    for (let i = 0; i < gbl_listX.length; i++) {
        if (
            gbl_listY[i] > gbl_canvasHeight + gbl_listR[i]
            ||
            gbl_listY[i] < 0 + gbl_listR[i]
            ||
            gbl_listX[i] > gbl_canvasWidth + gbl_listR[i]
            ||
            gbl_listX[i] < 0 + gbl_listR[i]
        ) {
            gbl_listX.splice(i, 1);
            gbl_listY.splice(i, 1);
            gbl_listR.splice(i, 1);
            gbl_listA.splice(i, 1);
            gbl_listT.splice(i, 1);
        }
    }

    //generate randoms
    let randomX = randomInt(1, 100);
    let randomY = randomInt(1, 100)
    let randomR = randomInt(1, 2);
    let randomA = randomInt(0, 360);

    //append new array items
    gbl_listX.push(gbl_canvasWidth / 2);
    gbl_listY.push(gbl_canvasHeight / 2);
    gbl_listR.push(randomR);
    gbl_listA.push(randomA);
    gbl_listT.push(1);
}

function draw() {
    //draw particle for each array item
    for (let i = 0; i < gbl_listX.length; i++) {
        ctx.fillStyle = 'white';

        ctx.globalAlpha = 0;

        let x = 40;
        if (gbl_listT[i] > x)
            ctx.globalAlpha = 0.1;
        if (gbl_listT[i] > x * 1.2)
            ctx.globalAlpha = 0.2;
        if (gbl_listT[i] > x * 1.4)
            ctx.globalAlpha = 0.3;
        if (gbl_listT[i] > x * 1.6)
            ctx.globalAlpha = 0.4;
        if (gbl_listT[i] > x * 1.8)
            ctx.globalAlpha = 0.5;
        if (gbl_listT[i] > x * 2)
            ctx.globalAlpha = 0.6;
        if (gbl_listT[i] > x * 2.2)
            ctx.globalAlpha = 0.7;
        if (gbl_listT[i] > x * 2.4)
            ctx.globalAlpha = 0.8;
        if (gbl_listT[i] > x * 2.6)
            ctx.globalAlpha = 0.9;

        gbl_listX[i] += Math.cos(gbl_listA[i]);
        gbl_listY[i] += Math.sin(gbl_listA[i] * 18);

        ctx.beginPath();
        ctx.arc(gbl_listX[i], gbl_listY[i], gbl_listR[i], 0, 360);
        //ctx.arc(randomX, randomY, randomR, 0, 360);
        ctx.fill()

        gbl_listT[i]++;
        ctx.globalAlpha = 1.0
    }

}

function drawText(fps: number) {
    const d = new Date();
    let hh = d.getHours().toString();
    let mm = d.getMinutes().toString();
    let ss = d.getSeconds().toString();
    let ms = d.getMilliseconds().toString();

    //ctx.fillStyle = 'black';
    //ctx.fillRect(0, 0, 280, 130);

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