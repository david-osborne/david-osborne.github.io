let gbl_canvasWidth = window.innerWidth, gbl_canvasHeight = window.innerHeight, cvs, ctx, secondsPassed, oldTimeStamp, fps = 0, gbl_timestampStart, shipAngle = 0, shipGridRow = 0, shipGridColumn = 0, shipVelocityX = 1, shipVelocityY = 1, shipMoveRate = 10, shipTurnRate = 5, theGrid = [], theGridSize = 200, gridCount = 0, gridsRendered = 0, worldSizeX = 0, worldSizeY = 0;
let shipPosition = {
    x: 0,
    y: 0
};
window.onload = init;
function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');
    //scaleCanvas();
    const startTime = new Date;
    gbl_timestampStart = startTime;
    createEventListeners();
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
function keyDown2(e) {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
    const p = document.createElement("p");
    p.textContent = `KeyboardEvent: key='${e.key}' | code='${e.code}'`;
    document.getElementById("output").appendChild(p);
}
function keyDown(e) {
    switch (e.code) {
        //left
        case "KeyA":
        case "ArrowLeft":
            shipAngle -= shipTurnRate;
            break;
        //right
        case "KeyD":
        case "ArrowRight":
            shipAngle += shipTurnRate;
            break;
        //up
        case "KeyW":
        case "ArrowUp":
            updatePosition(-shipMoveRate);
            /*
            shipPosition.y += Math.round(shipVelocityY);
            if (shipVelocityY < shipMoveRate)
                shipVelocityY *= 1.1;
                */
            break;
        //down
        case "KeyS":
        case "ArrowDown":
            updatePosition(shipMoveRate);
            /*
            shipPosition.y -= Math.round(shipVelocityY);
            if (shipVelocityY < shipMoveRate)
                shipVelocityY *= 1.1;
                */
            break;
    }
}
function updatePosition(offset) {
    let rad = shipAngle * (Math.PI / 180);
    shipPosition.x += Math.round(Math.sin(rad) * offset);
    shipPosition.y -= Math.round(Math.cos(rad) * offset);
}
function keyUp(e) {
    shipVelocityX = 1;
    shipVelocityY = 1;
}
function windowSize() {
    gbl_canvasWidth = window.innerWidth;
    gbl_canvasHeight = window.innerHeight;
    //scaleCanvas();
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
function drawShip(x, y) {
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
function drawFPS(fps) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 200, 140);
    ctx.textAlign = 'left';
    ctx.font = '14px Courier New';
    ctx.fillStyle = 'white';
    ctx.fillText('FPS: ' + fps, 10, 20);
    ctx.fillText('Ship Position X: ' + -shipPosition.x, 10, 34);
    ctx.fillText('Ship Position Y: ' + -shipPosition.y, 10, 48);
    ctx.fillText('Grid Count: ' + gridCount, 10, 62);
    ctx.fillText('Grids Rendered: ' + gridsRendered, 10, 76);
    ctx.fillText('Canvas Width: ' + gbl_canvasWidth, 10, 90);
    ctx.fillText('Canvas Height: ' + gbl_canvasHeight, 10, 104);
}
function drawGrid() {
    let size = theGridSize;
    ctx.strokeStyle = 'red';
    ctx.save();
    //ctx.translate((gbl_canvasWidth / 2) + shipPosition.x - (size / 2), (gbl_canvasHeight / 2) + shipPosition.y - (size / 2)); Center ship in grid
    ctx.translate((gbl_canvasWidth / 2) + shipPosition.x, (gbl_canvasHeight / 2) + shipPosition.y);
    let index = 0;
    gridsRendered = 0;
    theGrid.forEach(element => {
        if (
        //columns
        (element.x * size) + shipPosition.x >= ((0 - size) - (gbl_canvasWidth / 2))
            &&
                (element.x * size) + shipPosition.x <= (gbl_canvasWidth / 2) + size
            &&
                //rows
                (element.y * size) + shipPosition.y >= ((0 - size) - (gbl_canvasHeight / 2))
            &&
                (element.y * size) + shipPosition.y <= (gbl_canvasHeight / 2)) {
            ctx.strokeRect(element.x * size, element.y * size, size, size);
            ctx.font = 'Bold 11px Courier New';
            ctx.fillStyle = 'lime';
            ctx.fillText(element.x + '/' + element.y, element.x * size + 10, element.y * size + 14);
            let gridX = element.x * size, gridY = element.y * size;
            ctx.fillText('X: ' + gridX, element.x * size + 10, element.y * size + 26);
            ctx.fillText('Y: ' + gridY, element.x * size + 10, element.y * size + 36);
            drawStars(theGridSize, index);
            gridsRendered++;
        }
        index++;
    });
    ctx.restore();
}
function generateGrid(size) {
    // positive X / positive Y
    gridCount = 0;
    let gridWidth = Math.round((gbl_canvasWidth) / size), gridHeight = Math.round((gbl_canvasHeight + size) / size);
    for (let row = -Math.round(gridHeight / 2); row < Math.round(gridHeight / 2); row++) {
        for (let column = -Math.round(gridWidth / 2); column < Math.round(gridWidth / 2); column++) {
            theGrid.push({
                x: column,
                y: row,
                stars: []
            });
            gridCount++;
        }
    }
}
function gridLookup() {
    //let found = theGrid.find(({x})=> x === 10);
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateStars(size) {
    theGrid.forEach(grid => {
        let starCount = Math.sqrt(size);
        for (let i = 0; i < starCount; i++) {
            let starX = randomInt(0, size), starY = randomInt(0, size), starR = randomInt(1, 2);
            grid.stars.push({
                starX,
                starY,
                starR
            });
        }
    });
}
function drawStars(size, index) {
    theGrid[index].stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc((theGrid[index].x * size) + star.starX, (theGrid[index].y * size) + star.starY, star.starR, 0, 360);
        ctx.fill();
    });
}
//# sourceMappingURL=main.js.map