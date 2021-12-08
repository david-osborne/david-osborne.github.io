let gbl_canvasWidth: number = window.innerWidth,
    gbl_canvasHeight: number = window.innerHeight,
    gbl_particleMax: number = 100,
    cvs: any,
    ctx: any,
    secondsPassed: number,
    oldTimeStamp: number,
    fps: number = 0,
    gbl_particleCount: number = 0,
    gbl_timestampStart: Date,
    flakes: any[] = [];

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
    if (flakes.length < 400) {
        let randomColor: string = '#' + Math.random().toString(16).substr(2, 6);

        flakes.push({
            color: randomColor,
            posX: randomInt(0, gbl_canvasWidth),
            posY: randomInt(0, 100),
            xShift: randomInt(40,120),
            xDelta: 0,
            xDir: randomInt(1, 3),
            radius: randomInt(2, 4),
            opacity: Math.random() + 0.3, //math random generates between 0 and 1, sets min at 0.3
            velY: randomInt(20, 80) / 100,//(Math.random() * 1) + 0.5,
            velX: randomInt(1, 10) / 100,
            stepSize: (Math.random()) / 30,
            step: 0
        });
    }
}

function draw() {
    //draw particle for each array item
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i]; //get the flake from flakes

        /*
        //set fill color
        switch (flake.xDir) {
            case 1:
                ctx.fillStyle = 'white';
                break;
            case 2:
                ctx.fillStyle = 'green';
                break;
            case 3:
                ctx.fillStyle = 'blue';
                break;
        }
*/
        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";

        //draw filled circle
        ctx.beginPath();
        ctx.arc(flake.posX, flake.posY, flake.radius, 0, 360);
        ctx.fill();
    }
}

function iterateArrays() {
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i];

        flake.posY += flake.velY;
        if (flake.xDir != 1) {
            if (flake.xDelta < flake.xShift) {
                switch (flake.xDir) {
                    case 2:
                        flake.posX += 1 * flake.velX;
                        flake.xDelta++;
                        break;
                    case 3:
                        flake.posX -= 1 * flake.velX;
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
    ctx.fillStyle = 'orange';
    ctx.fillText('FPS: ' + fps, 10, gbl_canvasHeight - 40);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('Particles: ' + flakes.length.toString(), 10, gbl_canvasHeight - 20);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}