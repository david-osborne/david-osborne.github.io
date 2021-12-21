let gbl_canvasWidth = window.innerWidth, gbl_canvasHeight = window.innerHeight, cvs, ctx, secondsPassed, oldTimeStamp, fps = 0, gbl_timestampStart, shipAngle = 0, shipGridRow = 0, shipGridColumn = 0, shipVelocity = 0, shipMoveRate = 20, shipTurnRate = 5, theGrid = [], theGridDim = 200, theGridSize = 400, gridCount = 0, gridRows = 0, gridColumns = 0, gridsRendered = 0, worldSizeX = 0, worldSizeY = 0, showGrid = false, showStats = false, shotsFired = [], shotVelocity = 5, shotEnabled = true, shotInterval = 200, gbl_mouseX = 0, gbl_mouseY = 0, gbl_mouseAngle = 0, gbl_mouseDown = false;
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
    generateGrid(theGridDim);
    generateStars(theGridDim);
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
function createEventListeners() {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    window.addEventListener('resize', windowSize);
    cvs.addEventListener('mousemove', mouseMove);
    cvs.addEventListener('mousedown', mouseDown);
    cvs.addEventListener('mouseup', mouseUp);
    cvs.addEventListener('touchstart', touchStart);
    cvs.addEventListener('touchend', touchEnd);
}
function mouseDown() {
    fireShot();
    gbl_mouseDown = true;
}
function mouseUp() {
    gbl_mouseDown = false;
}
function mouseMove(e) {
    var rect = cvs.getBoundingClientRect(); //get canvas boundries
    gbl_mouseX = e.clientX - rect.left;
    gbl_mouseY = e.clientY - rect.top;
    setShipAngle();
}
function touchStart() {
    fireShot();
    gbl_mouseDown = true;
}
function touchEnd() {
    gbl_mouseDown = false;
}
function touchMove(e) {
    e.preventDefault();
    //var rect = cvs.getBoundingClientRect(); //get canvas boundries
    gbl_mouseX = e.touches[0].clientX;
    gbl_mouseY = e.touches[0].clientY;
    setShipAngle();
}
function setShipAngle() {
    // center point
    var p1 = {
        x: gbl_canvasWidth / 2,
        y: gbl_canvasHeight / 2
    };
    // mouse position
    var p2 = {
        x: gbl_mouseX,
        y: gbl_mouseY
    };
    // angle in radians
    var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    // angle in degrees
    var angleDeg = Math.round(angleRadians * (180 / Math.PI));
    gbl_mouseAngle = angleDeg;
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
            updatePosition('forward');
            break;
        //down
        case "KeyS":
        case "ArrowDown":
            updatePosition('reverse');
            break;
        case "Space":
            fireShot();
            break;
        case "KeyG":
            if (showGrid == true)
                showGrid = false;
            else if (showGrid == false)
                showGrid = true;
            break;
        case "Backquote":
            if (showStats == true)
                showStats = false;
            else if (showStats == false)
                showStats = true;
            break;
    }
}
function updatePosition(direction) {
    switch (direction) {
        case 'forward':
            if (shipVelocity < shipMoveRate)
                shipVelocity += 1.3;
            break;
        case 'reverse':
            if (shipVelocity > 0)
                shipVelocity -= 0.7;
            break;
    }
}
function shipMovement() {
    shipVelocity = Math.round(shipVelocity);
    let rad = shipAngle * (Math.PI / 180);
    shipPosition.x += Math.round(Math.sin(rad) * -shipVelocity);
    shipPosition.y -= Math.round(Math.cos(rad) * -shipVelocity);
}
function fireShot() {
    if (shotEnabled == true) {
        setTimeout(shotTimer, shotInterval);
        shotEnabled = false;
        shotsFired.push({
            x: -shipPosition.x,
            y: -shipPosition.y,
            angle: shipAngle,
            duration: 0,
            size: 3,
            shotVelocity: shipVelocity + shotVelocity
        });
    }
}
function shotTimer() {
    shotEnabled = true;
}
function drawShots() {
    const currentTime = new Date;
    shotsFired.forEach(shot => {
        let rad = shot.angle * (Math.PI / 180);
        shot.x += Math.round(Math.sin(rad) * shot.shotVelocity);
        shot.y -= Math.round(Math.cos(rad) * shot.shotVelocity);
        ctx.beginPath();
        ctx.fillStyle = 'magenta';
        ctx.arc(shot.x, shot.y, shot.size, 0, 360);
        ctx.fill();
        shot.duration++;
    });
    for (let i = 0; i < shotsFired.length; i++) {
        if (shotsFired[i].duration >= 100) {
            shotsFired.splice(i, 1);
        }
    }
}
function keyUp(e) {
    //shipVelocity = 0;
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
    //drawShield();
    drawShip(gbl_canvasWidth / 2, gbl_canvasHeight / 2);
    shipMovement();
    if (gbl_mouseDown)
        fireShot();
    if (showStats)
        drawFPS(fps);
    drawThrottle();
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
    shipAngle = gbl_mouseAngle + 90;
    ctx.save();
    let rad = shipAngle * Math.PI / 180;
    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.beginPath();
    // set line stroke and line width
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = 2;
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
function drawShield() {
    ctx.beginPath();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'red';
    ctx.fillStyle = "rgba(0,255,255," + .2 + ")";
    ctx.arc(gbl_canvasWidth / 2, gbl_canvasHeight / 2, 30, 0, 360);
    ctx.fill();
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.shadowBlur = 0;
}
function drawFPS(fps) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 200, 190);
    ctx.textAlign = 'left';
    ctx.font = '14px Courier New';
    ctx.fillStyle = 'white';
    ctx.fillText('FPS: ' + fps, 10, 20);
    ctx.fillText('Ship Position X: ' + -shipPosition.x, 10, 34);
    ctx.fillText('Ship Position Y: ' + -shipPosition.y, 10, 48);
    ctx.fillText('Grid Count: ' + gridCount, 10, 62);
    ctx.fillText('Grid Rows: ' + gridRows, 10, 76);
    ctx.fillText('Grid Columns: ' + gridColumns, 10, 90);
    ctx.fillText('Grids Rendered: ' + gridsRendered, 10, 104);
    ctx.fillText('Ship velocity: ' + shipVelocity, 10, 118);
    ctx.fillText('Show Grid: ' + showGrid, 10, 132);
    ctx.fillText('Mouse X: ' + gbl_mouseX, 10, 146);
    ctx.fillText('Mouse Y: ' + gbl_mouseY, 10, 160);
    ctx.fillText('Ship Angle: ' + shipAngle, 10, 174);
    ctx.fillText('Mouse Angle: ' + gbl_mouseAngle, 10, 188);
}
function drawGrid() {
    let size = theGridDim;
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
            if (showGrid == true) {
                ctx.strokeRect(element.x * size, element.y * size, size, size);
                ctx.font = 'Bold 11px Courier New';
                ctx.fillStyle = 'lime';
                ctx.fillText(element.x + '/' + element.y, element.x * size + 10, element.y * size + 14);
                let gridX = element.x * size, gridY = element.y * size;
                ctx.fillText('X: ' + gridX, element.x * size + 10, element.y * size + 26);
                ctx.fillText('Y: ' + gridY, element.x * size + 10, element.y * size + 36);
            }
            drawStars(theGridDim, index);
            gridsRendered++;
        }
        index++;
    });
    drawShots();
    ctx.restore();
}
function generateGrid(size) {
    // positive X / positive Y
    gridCount = 0;
    let gridWidth = theGridSize, gridHeight = theGridSize;
    for (let row = -gridHeight / 2; row < gridHeight / 2; row++) {
        for (let column = -gridWidth / 2; column < gridWidth / 2; column++) {
            theGrid.push({
                x: column,
                y: row,
                stars: [],
                opacity: Math.random() + 0.3,
            });
        }
        gridRows++;
        gridCount++;
    }
    gridColumns = gridWidth;
    gridCount = gridRows * gridColumns;
}
function gridLookup() {
    //let found = theGrid.find(({x})=> x === 10);
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateStars(size) {
    theGrid.forEach(grid => {
        let starCount = Math.sqrt(size / 4);
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
        ctx.fillStyle = "rgba(255,255,255," + theGrid[index].opacity + ")";
        ctx.arc((theGrid[index].x * size) + star.starX, (theGrid[index].y * size) + star.starY, star.starR, 0, 360);
        ctx.fill();
    });
}
function drawThrottle() {
    let throttlePercent = shipVelocity / shipMoveRate;
    ctx.beginPath();
    ctx.fillStyle = 'darkgreen';
    ctx.strokeStyle = 'lime';
    ctx.fillRect(gbl_canvasWidth - 40, gbl_canvasHeight - 20, 20, -100);
    ctx.strokeRect(gbl_canvasWidth - 40, gbl_canvasHeight - 20, 20, -100);
    ctx.fillStyle = 'lime';
    ctx.fillRect(gbl_canvasWidth - 38, gbl_canvasHeight - 22, 16, -96 * throttlePercent);
}
//# sourceMappingURL=main.js.map