//everytime the ship moves, update it's grid index

let gbl_canvasWidth = window.innerWidth,
    gbl_canvasHeight = window.innerHeight,
    cvs,
    ctx,
    secondsPassed,
    oldTimeStamp,
    fps = 0,
    gbl_timestampStart: Date,
    shipAngle: number = 0,
    shipGridRow: number = 0,
    shipGridColumn: number = 0,
    shipVelocity: number = 0,
    shipVelocityMax: number = 40,
    shipTurnRate: number = 5,
    shipThrottle: number = 0,
    theGrid: any[] = [],
    theGridDim: number = 200,
    theGridSize: number = 4, //should be even or the grid text display will be 'borked'
    gridCount: number = 0,
    gridRows: number = 0,
    gridColumns: number = 0,
    gridsRendered: number = 0,
    worldSizeX: number = 0,
    worldSizeY: number = 0,
    showGrid: boolean = true,
    showStats: boolean = true,
    shotsFired: any[] = [],
    shotVelocity: number = 2,
    shotDuration: number = 200,
    shotEnabled: boolean = true,
    shotInterval: number = 200,
    gbl_mouseX: number = 0,
    gbl_mouseY: number = 0,
    gbl_mouseAngle = 0,
    gbl_mouseDown: boolean = false,
    flameShift: number = 0,
    flameDir: number = 0,
    rocks: any[] = [];

let shipPosition = {
    x: 0,
    y: 0
}

window.onload = init;

function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');

    startGame();
}

function welcomeMessage() {
    clearCanvas();
    ctx.beginPath();
    ctx.fillStyle = 'cyan';
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 3;
    ctx.fillRect(gbl_canvasWidth / 2 - 200, gbl_canvasHeight / 2 - 200, 400, 400);
    ctx.stroke();
}

function startGame() {
    const startTime = new Date;
    gbl_timestampStart = startTime;

    createEventListeners();

    generateGrid(theGridDim);
    generateStars(theGridDim);
    generateRocks(theGridDim);

    setInterval(updateVelocity, 200);

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
    cvs.addEventListener('touchmove', touchMove);
    cvs.addEventListener('touchend', touchEnd);
    document.addEventListener('wheel', wheel);
}

function mouseDown() {
    fireShot();
    gbl_mouseDown = true;
}

function mouseUp() {
    gbl_mouseDown = false;
}

function wheel(e) {
    //e.preventDefault(); //disable default mouse scrolling behavior
    //let shipThrottle = shipVelocity;
    shipThrottle += e.deltaY * -0.1;

    //restrict shipThrottle between min and max
    shipThrottle = Math.min(Math.max(0, shipThrottle), 100);
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
        //leftww
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
            updateThrottle('up');
            break;
        //down
        case "KeyS":
        case "ArrowDown":
            updateThrottle('down');
            break;
        case "KeyQ":
            updateThrottle('kill');
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

function updateThrottle(action: string) {
    if (action == 'up') {
        if (shipThrottle <= 90)
            shipThrottle += 10;
    }
    if (action == 'down') {
        if (shipThrottle >= 10)
            shipThrottle -= 10;
    }
    if (action == 'kill') {
        shipThrottle = 0;
    }
}

function updateVelocity() {
    let targetVelocity: number = (shipThrottle / 100) * shipVelocityMax;
    if (shipVelocity < targetVelocity)
        shipVelocity++;
    if (shipVelocity > targetVelocity)
        shipVelocity--;
}

function shipMovement() {
    shipVelocity = Math.round(shipVelocity);
    let rad = shipAngle * (Math.PI / 180);
    shipPosition.x += Math.sin(rad) * -shipVelocity;
    shipPosition.y -= Math.cos(rad) * -shipVelocity;
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
            size: 2,
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

        shot.x += Math.sin(rad) * shot.shotVelocity;
        shot.y -= Math.cos(rad) * shot.shotVelocity;


        ctx.beginPath();
        ctx.strokeStyle = 'lime';
        ctx.fillStyle = "rgba(0,255,0," + 0.4 + ")"
        ctx.arc(shot.x, shot.y, shot.size + 2, 0, 360);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(shot.x, shot.y, shot.size, 0, 360);
        ctx.fill();

        ctx.textAlign = 'left';
        ctx.font = 'Bold 13px Courier New';
        ctx.fillStyle = 'magenta';
        ctx.fillText('X: ' + Math.round(shot.x), shot.x + 5, shot.y - 22);
        ctx.fillText('Y: ' + Math.round(shot.y), shot.x + 5, shot.y - 8);

        shot.duration++;
    });

    for (let i = 0; i < shotsFired.length; i++) {
        if (shotsFired[i].duration >= shotDuration) {
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
    drawTranslatedObjects();
    //drawShield();
    drawShip(gbl_canvasWidth / 2, gbl_canvasHeight / 2);
    shipMovement();
    if (gbl_mouseDown)
        fireShot();
    if (showStats)
        drawStats(fps);
    drawshipThrottle();

    drawMouseCrosshairs();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function drawMouseCrosshairs() {
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gbl_mouseX - 20, gbl_mouseY);
    ctx.lineTo(gbl_mouseX - 10, gbl_mouseY);
    ctx.moveTo(gbl_mouseX + 10, gbl_mouseY);
    ctx.lineTo(gbl_mouseX + 20, gbl_mouseY);
    ctx.moveTo(gbl_mouseX, gbl_mouseY - 20);
    ctx.lineTo(gbl_mouseX, gbl_mouseY - 10);
    ctx.moveTo(gbl_mouseX, gbl_mouseY + 10);
    ctx.lineTo(gbl_mouseX, gbl_mouseY + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(gbl_mouseX, gbl_mouseY, 10, 0, 360);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(gbl_mouseX, gbl_mouseY, 2, 0, 360);
    ctx.fill();

    let mousePosX = Math.round((gbl_canvasWidth / 2) - gbl_mouseX + shipPosition.x),
        mousePosY = Math.round((gbl_canvasHeight / 2) - gbl_mouseY + shipPosition.y);

    ctx.textAlign = 'left';
    ctx.font = 'Bold 13px Courier New';
    ctx.fillStyle = 'red';
    ctx.fillText('X: ' + -mousePosX, gbl_mouseX + 20, gbl_mouseY - 34);
    ctx.fillText('Y: ' + -mousePosY, gbl_mouseX + 20, gbl_mouseY - 20);
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

    shipAngle = gbl_mouseAngle + 90;

    ctx.save();
    let rad = shipAngle * Math.PI / 180;
    ctx.translate(x, y);

    ctx.rotate(rad);

    generateFlame();

    //ship
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.moveTo(0, -20); //nose of ship
    ctx.lineTo(12, 20); //lower right tip
    ctx.lineTo(0, 10); //center
    ctx.lineTo(-12, 20); //lower left tip
    ctx.lineTo(0, -20); //nose of ship
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function generateFlame() {
    let shipThrottlePercent = shipThrottle / 100,
        flameLengthMax: number = 500,
        flameOpacity: number = 0.8,
        flameColors: string[] = [
            "rgba(3, 109, 167,",
            "rgba(39, 196, 230,",
            "rgba(162, 53, 65,",
            "rgba(251, 72, 6,",
            "rgba(231, 121, 25,",
            "rgba(240, 169, 33,",
            "rgba(245, 203, 40,",
            "rgba(246, 223, 54,",
            "rgba(253, 250, 192,",
            "rgba(255, 253, 240,"
        ],
        flameIndex: number = 0,
        flameWidth: number = 11;

    if (shipThrottlePercent > 0.9) {
        drawFlame(1.0 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.8) {
        drawFlame(0.9 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.7) {
        drawFlame(0.8 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.6) {
        drawFlame(0.7 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.5) {
        drawFlame(0.6 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.4) {
        drawFlame(0.5 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.3) {
        drawFlame(0.4 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.2) {
        drawFlame(0.3 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0.1) {
        drawFlame(0.2 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
        flameIndex++;
    }
    flameWidth--;
    if (shipThrottlePercent > 0)
        drawFlame(0.1 * flameLengthMax, flameColors[flameIndex] + flameOpacity + ")", flameWidth);
}

function drawFlame(flameLength: number, color: string, width: number) {
    flameFlicker(3);

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.strokeStyle = 'magenta';
    ctx.lineWidth = 1;
    ctx.moveTo(width, 9 + width);
    ctx.quadraticCurveTo(flameShift, flameLength, -width, 9 + width);
    ctx.lineTo(0, 10);
    ctx.lineTo(width, 9 + width);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function flameFlicker(flameMax: number) {
    if (flameDir == 0 && flameShift < flameMax)
        flameShift++;
    if (flameShift == flameMax)
        flameDir = 1;
    if (flameDir == 1)
        flameShift--;
    if (flameShift == -flameMax)
        flameDir = 0;
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

function gridLookup(grid) {
    //let found = theGrid.find(({x})=> x === 10);
    return grid.x >= shipPosition.x;
}

function drawStats(fps: number) {
    ctx.fillStyle = 'deepskyblue';
    ctx.fillRect(0, 0, 200, 160);

    ctx.textAlign = 'left';
    ctx.font = '14px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText('FPS: ' + fps, 10, 20);
    ctx.fillText('Ship Position X: ' + -Math.round(shipPosition.x), 10, 34);
    ctx.fillText('Ship Position Y: ' + -Math.round(shipPosition.y), 10, 48);
    ctx.fillText('Ship Grid: ', 10, 62);
    ctx.fillText('Grid Count: ' + gridCount, 10, 76);
    ctx.fillText('Grid Rows: ' + gridRows, 10, 90);
    ctx.fillText('Grid Columns: ' + gridColumns, 10, 104);
    ctx.fillText('Grids Rendered: ' + gridsRendered, 10, 118);
    ctx.fillText('Ship velocity: ' + shipVelocity, 10, 132);
    ctx.fillText('Ship Throttle: ' + shipThrottle, 10, 146);
}

function drawTranslatedObjects() {
    // to improve performance, perform one transformation for all translated (shifted) objects
    ctx.save();
    //ctx.translate((gbl_canvasWidth / 2) + shipPosition.x - (size / 2), (gbl_canvasHeight / 2) + shipPosition.y - (size / 2)); Center ship in grid
    ctx.translate((gbl_canvasWidth / 2) + shipPosition.x, (gbl_canvasHeight / 2) + shipPosition.y);

    // call drawing for translated (shifted) objects
    drawGrid();
    drawShots();

    ctx.restore();
}

function drawGrid() {
    let size = theGridDim;

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
            (element.y * size) + shipPosition.y <= (gbl_canvasHeight / 2)

        ) {
            if (showGrid == true) {
                ctx.strokeStyle = 'dimgray';
                ctx.strokeRect(element.x * size, element.y * size, size, size);

                ctx.font = 'Bold 11px Courier New';
                ctx.fillStyle = 'cyan';
                ctx.fillText(element.x + '/' + element.y + '[' + theGrid.indexOf(element) + ']', element.x * size + 10, element.y * size + 14);

                let gridX: number = element.x * size,
                    gridY: number = element.y * size;
                ctx.fillText('X: ' + gridX, element.x * size + 10, element.y * size + 26);
                ctx.fillText('Y: ' + gridY, element.x * size + 10, element.y * size + 36);
            }

            drawStars(theGridDim, index);
            drawRocks(theGridDim, index);
            gridsRendered++;
        }

        index++;
    });
}

function generateGrid(size: number) {
    // positive X / positive Y
    gridCount = 0;

    let gridWidth = theGridSize,
        gridHeight = theGridSize;

    for (let row = -gridHeight / 2; row < gridHeight / 2; row++) {
        for (let column = -gridWidth / 2; column < gridWidth / 2; column++) {
            theGrid.push({
                x: column,
                y: row,
                stars: [],
                rocks: [],
                opacity: Math.random() + 0.3, //math random generates between 0 and 1, sets min at 0.3
            })
        }
        gridRows++;
        gridCount++;
    }
    gridColumns = gridWidth;
    gridCount = gridRows * gridColumns;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawshipThrottle() {
    let shipThrottlePercent = shipThrottle / 100;

    ctx.beginPath();
    ctx.fillStyle = 'darkgreen';
    ctx.strokeStyle = 'lime';
    ctx.fillRect(gbl_canvasWidth - 40, gbl_canvasHeight - 20, 20, -100);
    ctx.strokeRect(gbl_canvasWidth - 40, gbl_canvasHeight - 20, 20, -100);
    ctx.fillStyle = 'lime';
    ctx.fillRect(gbl_canvasWidth - 38, gbl_canvasHeight - 22, 16, -96 * shipThrottlePercent);
    ctx.textAlign = 'right';
    ctx.font = 'Bold 16px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText(shipThrottle + '%', gbl_canvasWidth - 20, gbl_canvasHeight - 130);
}

function generateStars(size: number) {
    theGrid.forEach(grid => {
        let starCount = Math.sqrt(size / 4);
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

function generateRocks(size: number) {
    theGrid.forEach(grid => {
        //for (let count = 0; count < rockCount; count++) {

        let determine = randomInt(0, 100);  //number between 0 and 1
        if (determine >= 50) { //2% chance of a rock in a grid
        //if (determine >= 98) { //2% chance of a rock in a grid

            let points: any[] = [],
                centerX = randomInt(0, size),
                centerY = randomInt(0, size),
                radius = randomInt(10, 40),
                rotateSpeed = Math.random();

            let angle = 0;
            for (let i = 0; i < 12; i++) {
                let distance = .9 + Math.random();
                let x = radius * Math.cos(angle * Math.PI / 180) * distance;
                let y = radius * Math.sin(angle * Math.PI / 180) * distance;
                points.push({
                    x,
                    y
                });
                angle += 30;
            }

            let rotationAngle = 0;

            grid.rocks.push({
                centerX,
                centerY,
                radius,
                points,
                rotationAngle,
                rotateSpeed
            });
        }
    });
}

function drawStars(size: number, index: number) {
    theGrid[index].stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255," + theGrid[index].opacity + ")";
        ctx.arc((theGrid[index].x * size) + star.starX, (theGrid[index].y * size) + star.starY, star.starR, 0, 360);
        ctx.fill();

        /*
        ctx.textAlign = 'left';
        ctx.font = '10px Courier New';
        ctx.fillStyle = 'yellow';
        ctx.fillText('X: ' + Math.round((theGrid[index].x * size) + star.starX) + ' Y: ' + Math.round((theGrid[index].y * size) + star.starY), (theGrid[index].x * size) + star.starX + 4, (theGrid[index].y * size) + star.starY + 4);
        */
    });
}

function drawRocks(size: number, index: number) {
    theGrid[index].rocks.forEach(rock => {

        ctx.save();
        //ctx.translate(300,300);
        ctx.translate(rock.centerX + theGrid[index].x * size, rock.centerY + theGrid[index].y * size);
        let rad = (rock.rotationAngle * Math.PI / 180) * rock.rotateSpeed;
        ctx.rotate(rad);

        ctx.beginPath();
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.font = 'Bold 16px Courier New';
        ctx.fillStyle = 'lime';

        // move to the first point
        ctx.moveTo(rock.points[0].x, rock.points[0].y);

        let i = 0;

        for (i = 1; i < rock.points.length - 1; i++) {
            var xc = (rock.points[i].x + rock.points[i + 1].x) / 2;
            var yc = (rock.points[i].y + rock.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(rock.points[i].x, rock.points[i].y, xc, yc);
        }
        // curve through the last two points
        ctx.quadraticCurveTo(rock.points[11].x, rock.points[11].y, rock.points[0].x, rock.points[0].y);
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'dimgray';
        ctx.fill();

        /* draw radius
        ctx.beginPath();
        ctx.arc(0, 0, rock.radius, 0, 360);
        ctx.stroke();
*/
        ctx.textAlign = 'left';
        ctx.font = 'Bold 13px Courier New';
        ctx.fillStyle = 'lime';
        ctx.fillText('X: ' + Math.round(rock.centerX + (theGrid[index].x * size)), -rock.centerX, rock.centerY - 14);
        ctx.fillText('Y: ' + Math.round(rock.centerY + (theGrid[index].y * size)), -rock.centerX, rock.centerY);

        ctx.restore();

        rock.rotationAngle++;
    });
}