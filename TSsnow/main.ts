let gbl_canvasWidth: number = window.innerWidth,
    gbl_canvasHeight: number = window.innerHeight,
    gbl_meltTime: number = 2000,
    cvs: any,
    ctx: any,
    secondsPassed: number,
    oldTimeStamp: number,
    fps: number = 0,
    gbl_particleCount: number = 0,
    gbl_timestampStart: Date,
    gbl_imageX: number = 0,
    gbl_imageY: number = 100,
    flakes: any[] = [],
    image: any;

window.onload = init;

function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');

    const startTime: Date = new Date;
    gbl_timestampStart = startTime;

    createEventListeners();

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function createEventListeners() {
    window.addEventListener('resize', windowSize);
}

function windowSize() {
    gbl_canvasWidth = window.innerWidth;
    gbl_canvasHeight = window.innerHeight;

    ctx.canvas.width = gbl_canvasWidth;
    ctx.canvas.height = gbl_canvasHeight;

    flakes = [];
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    clearCanvas();
    if (fps >= 60)
        generateArrays();
    drawSleigh();
    draw();
    drawText(fps);
    iterateArrays();
    cleanArrays();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function generateCanvas() {
    const body: HTMLElement = document.getElementById('body');
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = gbl_canvasWidth;
    canvas.height = gbl_canvasHeight;
    body.appendChild(canvas);
}

function clearCanvas() {
    ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}

function generateArrays() {
    let randomColor: string = '#' + Math.random().toString(16).substr(2, 6);

    flakes.push({
        color: randomColor,
        posX: randomInt(0, gbl_canvasWidth),
        posY: randomInt(0, (gbl_canvasHeight * 0.3)),
        xShift: randomInt(100, 200),
        xDelta: 0,
        xDir: randomInt(1, 3),
        radius: randomInt(2, 4),
        opacity: Math.random() + 0.3, //math random generates between 0 and 1, sets min at 0.3
        velY: randomInt(3, 10) / 10, //results in 0.3 to 1.0
        velX: randomInt(1, 10) / 100, //results in 0.01 to 0.1
        meltTime: 0,
        type: randomInt(1, 100)
    });
}

function draw() {
    //draw particle for each array item
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i]; //get the flake from flakes

        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";

        //draw filled circle
        ctx.beginPath();
        ctx.arc(flake.posX, flake.posY, flake.radius, 0, 360);
        ctx.fill();
    }
}

function drawSleigh() {
    if (!image) {
        let imgSleigh = new Image();
        imgSleigh.src = 'img/sleigh.png';
        image = imgSleigh;
    }
    let imgW = 300,
        imgH = 144;

    if (gbl_imageX < gbl_canvasWidth)
        gbl_imageX++;
    else
        gbl_imageX = 0 - imgW;

    ctx.drawImage(image, gbl_imageX, gbl_imageY, imgW, imgH);
}

function iterateArrays() {
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i];

        if (flake.posY < (gbl_canvasHeight - flake.radius)) {
            flake.posY += flake.velY;

            if (flake.type == 1) {
                flake.posX += flake.velX + 1;
                flake.posY += 2;
            }

            else if (flake.xDir != 1) {
                if (flake.xDelta < flake.xShift) {
                    switch (flake.xDir) {
                        case 2:
                            flake.posX += flake.velX;
                            flake.xDelta++;
                            break;
                        case 3:
                            flake.posX -= flake.velX;
                            flake.xDelta++;
                            break;
                    }
                }
                else if (flake.xDelta = flake.xShift) {
                    switch (flake.xDir) {
                        case 2:
                            flake.xDir = 3;
                            flake.xDelta = 0;
                            break;
                        case 3:
                            flake.xDir = 2;
                            flake.xDelta = 0;
                            break;
                    }
                }
            }
        }
        else {
            flake.meltTime++;
        }
    }
}

function cleanArrays() {
    for (let i = 0; i < flakes.length; i++) {
        var flake: any = flakes[i];
        if (
            flake.posY > gbl_canvasHeight
            ||
            flake.posY < 0
            ||
            flake.posX > gbl_canvasWidth
            ||
            flake.posX < 0
            ||
            flake.meltTime >= gbl_meltTime
        ) {
            flakes.splice(i, 1);
        }
    }
}

function drawText(fps: number) {
    const d = new Date();
    let hh = d.getHours().toString();
    let mm = d.getMinutes().toString();
    let ss = d.getSeconds().toString();
    let ms = d.getMilliseconds().toString();

    ctx.font = '24px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText('FPS: ' + fps, 10, gbl_canvasHeight - 40);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText('Particles: ' + flakes.length.toString(), 10, gbl_canvasHeight - 20);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}