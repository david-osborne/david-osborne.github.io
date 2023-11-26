let gbl_canvasWidth:number = window.innerWidth,
    gbl_canvasHeight:number = window.innerHeight,
    cvs:any,
    ctx:any,
    secondsPassed:number,
    oldTimeStamp:number,
    fps:number = 0,
    gbl_particleCount:number = 0,
    gbl_timestampStart: Date,
    flakes:any[] = [];

window.onload = init;

function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');

    const startTime:Date = new Date;
    gbl_timestampStart = startTime;

    //createEventListeners();

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
    //iterateArrays();
    cleanArrays();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function generateCanvas() {
    const body:HTMLElement = document.getElementById('body');
    const canvas:HTMLCanvasElement = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = gbl_canvasWidth;
    canvas.height = gbl_canvasHeight;
    body.appendChild(canvas);
}

function clearCanvas() {
    ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}

function iterateArrays() {
    for (let i = 0; i < flakes.length; i++) {
        var flake:any = flakes[i];
        if (
            flake.ypos < gbl_canvasHeight
        ) {
            flake.ypos = flake.ypos + 1;
        }
    }
}

function generateArrays() {
    let randomColor:string = '#' + Math.random().toString(16).substr(2, 6),
        speedcalc:number = (Math.random() * 1) + 0.5;

    flakes.push({
        color: randomColor,
        xpos: randomInt(0, gbl_canvasWidth),
        ypos: randomInt(0, 100),
        radius: randomInt(2, 4),
        opacity: Math.random() + 0.3, //math random generates between 0 and 1, sets min at 0.3
        speed: speedcalc,
        velY: speedcalc,
        velX: 0,
        stepSize: (Math.random()) / 30,
        step: 0
    });
}

function draw() {
    //draw particle for each array item
    for (let i = 0; i < flakes.length; i++) {
        var flake = flakes[i], //get the flake from flakes
            minDist = 150,
            x2 = flake.xpos,
            y2 = flake.ypos,
            //dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
            dist = Math.sqrt((x2) * (x2) + (y2) * (y2));

        if (dist < minDist) {
            var force = minDist / (dist * dist),
                xcomp = flake.xpos / dist,
                ycomp = flake.ypos / dist,
                deltaV = force / 2;

            flake.velX -= deltaV * xcomp;
            flake.velY -= deltaV * ycomp;
        }
        else {
            flake.velX *= .98;
            if (flake.velY <= flake.speed)
                flake.velY = flake.speed;
            flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
        }

        //set fill color
        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";

        //draw filled circle
        ctx.beginPath();
        ctx.arc(flake.xpos, flake.ypos, flake.radius, 0, 360);
        ctx.fill();

        flake.xpos += flake.velX;
        flake.ypos += flake.velY;
    }
}

function cleanArrays() {
    for (let i = 0; i < flakes.length; i++) {
        var flake:any = flakes[i];
        if (
            flake.ypos >= gbl_canvasHeight - flake.radius
            ||
            flake.xpos > gbl_canvasWidth + flake.radius
            //||
            //flake.xpos < 0 - flake.radius
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
    ctx.fillText('FPS: ' + fps, 10, gbl_canvasHeight-40);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('Particles: ' + flakes.length.toString(), 10, gbl_canvasHeight-20);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}