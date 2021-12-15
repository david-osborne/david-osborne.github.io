let gbl_canvasWidth = window.innerWidth,
    gbl_canvasHeight = window.innerHeight,
    cvs,
    ctx,
    secondsPassed,
    oldTimeStamp,
    fps = 0,
    gbl_timestampStart: Date,
    shipAngle: number = 0,
    shipPosX: number,
    shipPosY: number,
    theGrid: any[] = [],
    theGridSize: number = 200;

window.onload = init;

function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');

    //scaleCanvas();

    const startTime = new Date;
    gbl_timestampStart = startTime;

    createEventListeners();

    centerShip();
    generateGrid(theGridSize);

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function createEventListeners() {
    document.addEventListener('keydown', keyDown);
    window.addEventListener('resize', windowSize);
}

function centerShip() {
    shipPosX = gbl_canvasWidth / 2;
    shipPosY = gbl_canvasHeight / 2;
}

function keyDown(e) {
    let rotateSpeed: number = 2;
    switch (e.keyCode) {
        case 37: //left
            shipAngle -= rotateSpeed;
            break;
        case 39: //right
            shipAngle += rotateSpeed;
            break;
        case 38: //up
            //do something
            break;
        case 40: //down
            //do something
            break;

    }
}

function windowSize() {
    gbl_canvasWidth = window.innerWidth;
    gbl_canvasHeight = window.innerHeight;

    //scaleCanvas();
    ctx.canvas.width = gbl_canvasWidth;
    ctx.canvas.height = gbl_canvasHeight;

    centerShip();
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    clearCanvas();
    drawShip(shipPosX, shipPosY);
    drawFPS(fps);

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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}

function drawShip(x: number, y: number) {

    //ctx.imageSmoothingEnabled = true;
    //ctx.imageSmoothingQuality = "high";

    ctx.save();
    let rad = shipAngle * Math.PI / 180;
    ctx.translate(x, y);

    drawGrid();

    ctx.rotate(rad);

    // set line stroke and line width
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = 2;

    ctx.beginPath();
    //ctx.translate(0.5,0.5);
    ctx.moveTo(0, -20);
    ctx.lineTo(12, 20);
    ctx.lineTo(0, 10);
    ctx.lineTo(-12, 20);
    ctx.lineTo(0, -20);
    ctx.fill();
    ctx.stroke();
    /*
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, -1200);
        ctx.strokeStyle = 'magenta';
        ctx.lineWidth = 2;
        ctx.stroke();
    */

    ctx.restore();
}

function drawFPS(fps: number) {
    ctx.textAlign = 'left';
    ctx.font = '14px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('FPS: ' + fps, 10, gbl_canvasHeight - 40);
}


function drawGrid() {
    ctx.strokeStyle = 'red';
    let size = theGridSize;

    theGrid.forEach(element => {
        ctx.strokeRect(element.x * size, element.y * size, size, size);
    });

}

function generateGrid(size: number) {
    // positive X / positive Y

    for (let row = 0; row <= 10; row++) {
        for (let column = 0; column <= 10; column++) {
            theGrid.push({
                x: row,
                y: column
            })
        }
    }
}