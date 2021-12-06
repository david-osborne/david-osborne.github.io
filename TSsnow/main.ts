let gbl_canvasWidth = window.innerWidth,
    gbl_canvasHeight = window.innerHeight,
    cvs,
    ctx,
    secondsPassed,
    oldTimeStamp,
    fps = 0,
    gbl_particleCount = 0,
    gbl_timestampStart: Date,
    flakes = [];

window.onload = init;

function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');

    //scaleCanvas();

    const startTime = new Date;
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
    const body = document.getElementById('body');
    const canvas = document.createElement('canvas');
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
    let randomColor = '#' + Math.random().toString(16).substr(2, 6);

    flakes.push({
        color: randomColor,
        angle: randomInt(0, 360),
        xpos: randomInt(0, gbl_canvasWidth),
        ypos: 10,
        radius: randomInt(2, 4),
        opacity: Math.random() + 0.3
    });
}

function iterateArrays() {
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i];
        if (
            flake.ypos < gbl_canvasHeight
        ) {
            flake.ypos = flake.ypos + 1;
        }
    }
}

function cleanArrays() {
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i];
        if (
            flake.ypos >= gbl_canvasHeight - flake.radius
            ||
            flake.ypos < 0 + flake.radius
            ||
            flake.xpos > gbl_canvasWidth + flake.radius
            ||
            flake.xpos < 0 + flake.radius
            ||
            flake.radius == 1
        ) {
            flakes.splice(i, 1);
        }
    }
}

function draw() {
    //draw particle for each array item
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i];

        //set fill color
        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";

        //draw filled circle
        ctx.beginPath();
        ctx.arc(flake.xpos, flake.ypos, flake.radius, 0, 360);
        ctx.fill();
    }
}

function drawText(fps: number) {
    const d = new Date();
    let hh = d.getHours().toString();
    let mm = d.getMinutes().toString();
    let ss = d.getSeconds().toString();
    let ms = d.getMilliseconds().toString();

    ctx.fillStyle = 'dimgray';
    ctx.fillRect(0, 0, 280, 130);

    ctx.font = '24px Courier New';
    ctx.fillStyle = 'orange';
    ctx.fillText('FPS: ' + fps, 10, 22);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('Timestamp: ' + hh + ':' + mm + ':' + ss + '.' + ms, 10, 40);
    ctx.fillText('Particle count: ' + flakes.length.toString(), 10, 80);
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