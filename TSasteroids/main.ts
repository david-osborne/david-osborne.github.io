let gbl_canvasWidth = window.innerWidth,
    gbl_canvasHeight = window.innerHeight,
    cvs,
    ctx,
    secondsPassed,
    oldTimeStamp,
    fps = 0,
    gbl_timestampStart: Date,
    shipAngle: number = 0,
    shipPosX: number = 0,
    shipPosY: number = 0,
    shipVx: number = 1,
    shipVy: number = 1,
    shipDir: number = 0,  // 0 = none, 1 = up, 2 = right, 3 = down, 4 = left
    theGrid: any[] = [],
    theGridSize: number = 200,
    gridCount: number = 0,
    gridsRendered: number = 0,
    worldSizeX: number = 0,
    worldSizeY: number = 0;

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
    generateStars(theGridSize);

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function createEventListeners() {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    window.addEventListener('resize', windowSize);
}

function centerShip() {
    //shipPosX = gbl_canvasWidth / 2;
    //shipPosY = gbl_canvasHeight / 2;
}

function keyDown(e) {
    let rotateSpeed: number = 2;
    switch (e.keyCode) {
        case 37: //left
            //shipAngle += rotateSpeed;
            shipPosX += Math.round(shipVx);
            if (shipVx < 15)
                shipVx *= 1.1;
            shipDir = 4;
            break;
        case 39: //right
            //shipAngle -= rotateSpeed;
            shipPosX -= Math.round(shipVx);
            if (shipVx < 15)
                shipVx *= 1.1;
            shipDir = 2;
            break;
        case 38: //up
            shipPosY += Math.round(shipVy);
            if (shipVy < 15)
                shipVy *= 1.1;
            shipDir = 1;
            break;
        case 40: //down
            shipPosY -= Math.round(shipVy);
            if (shipVy < 15)
                shipVy *= 1.1;
            shipDir = 3;
            break;
    }
}

function keyUp(e) {
    shipVx = 1;
    shipVy = 1;
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
    drawGrid();
    drawShip(gbl_canvasWidth / 2, gbl_canvasHeight / 2);
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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 200, 120);

    ctx.textAlign = 'left';
    ctx.font = '14px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('FPS: ' + fps, 10, 20);
    ctx.fillText('Ship Position X: ' + -shipPosX, 10, 34);
    ctx.fillText('Ship Position Y: ' + -shipPosY, 10, 48);
    ctx.fillText('Grid Count: ' + gridCount, 10, 62);
    ctx.fillText('Grids Rendered: ' + gridsRendered, 10, 76);
    ctx.fillText('Canvas Width: ' + gbl_canvasWidth, 10, 90);
    ctx.fillText('Canvas Height: ' + gbl_canvasHeight, 10, 104);
}


function drawGrid() {
    let size = theGridSize;
    ctx.strokeStyle = 'red';

    ctx.save();
    ctx.translate((gbl_canvasWidth / 2) + shipPosX - (size / 2), (gbl_canvasHeight / 2) + shipPosY - (size / 2));

    let index = 0;

    gridsRendered = 0;

    theGrid.forEach(element => {
        if (
            //columns
            (element.x * size) + shipPosX >= ((0 - size) - (gbl_canvasWidth / 2))
            &&
            (element.x * size) + shipPosX <= (gbl_canvasWidth / 2) + size
            &&
            //rows
            (element.y * size) + shipPosY >= ((0 - size) - (gbl_canvasHeight / 2))
            &&
            (element.y * size) + shipPosY <= (gbl_canvasHeight / 2)

        ) {
            ctx.strokeRect(element.x * size, element.y * size, size, size);
            ctx.font = 'Bold 11px Courier New';
            ctx.fillStyle = 'lime';
            ctx.fillText(element.x + '/' + element.y, element.x * size + 10, element.y * size + 14);
            let gridX: number = element.x * size,
                gridY: number = element.y * size;
            ctx.fillText('X: ' + gridX, element.x * size + 10, element.y * size + 26);
            ctx.fillText('Y: ' + gridY, element.x * size + 10, element.y * size + 36);

            drawStars(theGridSize, index);
            gridsRendered++;
        }

        index++;
    });



    ctx.restore();
}

function generateGrid(size: number) {
    // positive X / positive Y
    gridCount = 0;

    let gridWidth = Math.round((gbl_canvasWidth * 4) / size),
        gridHeight = Math.round((gbl_canvasHeight * 4) / size);

    for (let row = -Math.round(gridHeight / 2); row < Math.round(gridHeight / 2); row++) {
        for (let column = -Math.round(gridWidth / 2); column < Math.round(gridWidth / 2); column++) {
            theGrid.push({
                x: column,
                y: row,
                stars: []
            })
            gridCount++;
        }
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateStars(size: number) {
    theGrid.forEach(grid => {
        let starCount = Math.sqrt(size);
        for (let i = 0; i < starCount; i++) {
            let starX = randomInt(0, size),
                starY = randomInt(0, size),
                starR = randomInt(1, 2);
            grid.stars.push({
                starX,
                starY,
                starR
            })
        }
    });
}

function drawStars(size: number, index: number) {
    theGrid[index].stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc((theGrid[index].x * size) + star.starX, (theGrid[index].y * size) + star.starY, star.starR, 0, 360);
        ctx.fill();
    });
}