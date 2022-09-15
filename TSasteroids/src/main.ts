//https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html
// in order to allow use of modules and multiple code files, when running locally, and not on a web server, must use the below chrome startup flag:
//C:\ ... \Application\chrome.exe --allow-file-access-from-files

import { Person } from './classes/person.js';
const somePerson: Person = new Person;

import { playSoundEffect } from './classes/audio.js';
import { playSong } from './classes/audio.js';

somePerson.printSomething();


let gbl_canvasWidth = window.innerWidth,
    gbl_canvasHeight = window.innerHeight,
    cvs,
    ctx,
    secondsPassed,
    oldTimeStamp,
    fps = 0,
    gbl_timestampStart: Date,
    theGrid: any[] = [],
    theGridDim: number = 200,
    theGridQty: number = 200,
    gridCount: number = 0,
    gridRows: number = 0,
    gridColumns: number = 0,
    gridsRendered: number = 0,
    worldSizeX: number = 0,
    worldSizeY: number = 0,
    showGrid: boolean = false,
    showStats: boolean = false,
    showMouse: boolean = true,
    shotsFired: any[] = [],
    shotVelocity: number = 6,
    shotDuration: number = 100,
    shotEnabled: boolean = true,
    shotInterval: number = 100,
    gbl_mouseX: number = 0,
    gbl_mouseY: number = 0,
    gbl_mouseAngle = 0,
    gbl_mouseDown: boolean = false,
    rocksExploding: any[] = [],
    viewEdgeLeft: number,
    viewEdgeRight: number,
    viewEdgeTop: number,
    viewEdgeBottom: number,
    rockPointsDurationMax: number = 50,
    pointsTotal: number = 0;

interface iShip {
    angle: number;
    gridRow: number;
    gridColumn: number;
    velocity: number;
    velocityMax: number;
    turnRate?: number;
    throttle: number;
}

interface iParticle {
    centerX: number;
    centerY: number;
    radius: number;
    points: any;
    rotationAngle?: number;
    rotationCW?: boolean, //clockwise rotation
    rotateSpeed?: number;
    color: string;
    angle?: number;
    duration?: number;
}

let rocks: iParticle[] = [];
let flameParticle: iParticle[] = [];
let burstParticle: iParticle[] = [];
let ship: iShip = {
    angle: 0,
    gridRow: 0,
    gridColumn: 0,
    velocity: 0,
    velocityMax: 10,
    turnRate: 0,
    throttle: 0
};

function createFlameParticle() {

}
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

    //init sounds
    playSoundEffect("explosion");
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
    ship.throttle += e.deltaY * -0.1;

    //restrict shipThrottle between min and max
    ship.throttle = Math.min(Math.max(0, ship.throttle), 100);
}

function mouseMove(e) {
    var rect = cvs.getBoundingClientRect(); //get canvas boundries
    gbl_mouseX = e.clientX - rect.left;  //get mouse X pos, set to global
    gbl_mouseY = e.clientY - rect.top;  //get mouse Y pos, set to global

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
    ship.angle = gbl_mouseAngle + 90;
}

function keyDown(e) {
    switch (e.code) {
        //left
        case "KeyA":
        case "ArrowLeft":
            ship.angle = ship.angle * 1.1;
            //shipAngle -= shipTurnRate;
            break;
        //right
        case "KeyD":
        case "ArrowRight":
            ship.angle = ship.angle * 0.9;
            //shipAngle += shipTurnRate;
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
        case "KeyM":
            if (showMouse == true)
                showMouse = false;
            else if (showMouse == false)
                showMouse = true;
            break;
    }
}

function updateThrottle(action: string) {
    if (action == 'up') {
        if (ship.throttle <= 90)
            ship.throttle += 10;
    }
    if (action == 'down') {
        if (ship.throttle >= 10)
            ship.throttle -= 10;
    }
    if (action == 'kill') {
        ship.throttle = 0;
    }
}

function updateVelocity() {
    let targetVelocity: number = Math.round((ship.throttle / 100) * ship.velocityMax)
        ;
    if (ship.velocity < targetVelocity)
        ship.velocity++;
    if (ship.velocity > targetVelocity)
        ship.velocity--;
}

function shipMovement() {
    ship.velocity = Math.round(ship.velocity);
    let rad = ship.angle * (Math.PI / 180);
    shipPosition.x += Math.sin(rad) * -ship.velocity;
    shipPosition.y -= Math.cos(rad) * -ship.velocity;
}

function fireShot() {
    if (shotEnabled == true) {
        setTimeout(shotTimer, shotInterval);
        shotEnabled = false;

        shotsFired.push({
            centerX: -shipPosition.x,
            centerY: -shipPosition.y,
            angle: ship.angle,
            duration: 0,
            radius: 2,
            shotVelocity: ship.velocity + shotVelocity,
            boolean: false
        });

        playSoundEffect("laser");
        playSong("introTheme");
    }
}

function shotTimer() {
    shotEnabled = true;
}

function drawShots() {
    const currentTime = new Date;

    shotsFired.forEach(shot => {
        let rad = shot.angle * (Math.PI / 180);

        // increment the shot position
        shot.centerX += Math.sin(rad) * shot.shotVelocity * 1.5;
        shot.centerY -= Math.cos(rad) * shot.shotVelocity * 1.5;

        //console.log('X: ' + Math.round(shot.x) + ' Y: ' + Math.round(shot.y));

        /*
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(shot.centerX, shot.centerY, shot.radius, 0, 360);
        ctx.fill();
*/

        ctx.beginPath();
        ctx.strokeStyle = 'cyan';
        ctx.fillStyle = 'magenta';
        ctx.lineWidth = 2;
        ctx.moveTo(shot.centerX, shot.centerY);

        var length = 12;
        let rad2 = (shot.angle + 90 + 15) * (Math.PI / 180);
        var x2 = Math.cos(rad2) * length;
        var y2 = Math.sin(rad2) * length;
        ctx.lineTo(shot.centerX + x2, shot.centerY + y2);

        let rad3 = (shot.angle + 90 - 15) * (Math.PI / 180);
        var x3 = Math.cos(rad3) * length;
        var y3 = Math.sin(rad3) * length;
        ctx.lineTo(shot.centerX + x3, shot.centerY + y3);

        ctx.lineTo(shot.centerX, shot.centerY);
        ctx.fill();
        ctx.stroke();

        //ctx.fillStyle = "rgba(0,255,0," + 0.4 + ")"  //semi-transparent fill
        //ctx.arc(shot.centerX, shot.centerY, shot.radius + 2, 0, 360);

        /*
        if (showStats) {
            ctx.textAlign = 'left';
            ctx.font = 'Bold 13px Courier New';
            ctx.fillStyle = 'magenta';
            ctx.fillText('X: ' + Math.round(shot.centerX), shot.centerX + 5, shot.centerY - 22);
            ctx.fillText('Y: ' + Math.round(shot.centerY), shot.centerX + 5, shot.centerY - 8);
        }
*/
        shot.duration++;
    });

    // delete the shot from the array if it's exceeded the global duration limit
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
    determineViewBoundries();
    drawTranslatedObjects();
    drawShip(gbl_canvasWidth / 2, gbl_canvasHeight / 2);

    shipMovement();
    if (gbl_mouseDown)
        fireShot();
    if (showStats)
        drawStats(fps);
    drawshipThrottle();

    if (showMouse)
        //drawMouseLine();
        drawMouseCrosshairs();

    drawMouseCircle();

    collisionDetection();

    cleanup();

    drawPoints();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function determineViewBoundries() {
    // determine bounding view box
    viewEdgeLeft = -Math.round(shipPosition.x + (gbl_canvasWidth / 2));
    viewEdgeRight = -Math.round(shipPosition.x - (gbl_canvasWidth / 2));
    viewEdgeTop = -Math.round(shipPosition.y + (gbl_canvasHeight / 2));
    viewEdgeBottom = -Math.round(shipPosition.y - (gbl_canvasHeight / 2));
}

function drawMouseCircle() {
    let distance = getDistance(gbl_mouseX, gbl_mouseY, gbl_canvasWidth / 2, gbl_canvasHeight / 2);

    ctx.beginPath();
    ctx.arc(gbl_canvasWidth / 2, gbl_canvasHeight / 2, distance, 0, 360);
    ctx.strokeStyle = 'red';
    ctx.setLineDash([5, 15]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,0,0, 0.2)";
    ctx.fill();
}

function getDistance(x1: number, y1: number, x2: number, y2: number) {
    //https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas#:~:text=If%20you%20have%20two%20points%20%28x1%2C%20y1%29%20and,%2B%20b%2Ab%29%3B%20%2F%2F%20c%20is%20the%20distance%20Share
    //pythagoras theorem
    var a = x1 - x2;
    var b = y1 - y2;
    var c = Math.sqrt(a * a + b * b);
    return c;
}

function drawMouseLine() {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gbl_mouseX, gbl_mouseY);
    ctx.lineTo(gbl_canvasWidth / 2, gbl_canvasHeight / 2);
    ctx.stroke();
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

    if (showStats) {
        ctx.textAlign = 'left';
        ctx.font = 'Bold 13px Courier New';
        ctx.fillStyle = 'red';
        ctx.fillText('X: ' + -mousePosX, gbl_mouseX + 20, gbl_mouseY - 34);
        ctx.fillText('Y: ' + -mousePosY, gbl_mouseX + 20, gbl_mouseY - 20);
    }
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
    let rad = ship.angle * Math.PI / 180;
    ctx.translate(x, y);

    ctx.rotate(rad);

    //drawShield();

    //generateFlame();
    drawFlame();

    //ship
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = "blue";
    ctx.lineWidth = 2;

    ctx.moveTo(0, -20); //nose of ship
    ctx.lineTo(12, 20); //lower right tip
    ctx.lineTo(0, 10); //center
    ctx.lineTo(-12, 20); //lower left tip
    ctx.lineTo(0, -20); //nose of ship
    ctx.fill();
    ctx.stroke();

    //shot range
    /*
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.arc(0, 0, 100, 0, .25 * Math.PI);
    ctx.stroke();
*/
    ctx.restore();
}

function drawFlame() {

    let x1 = 0;
    let y1 = 10;
    for (let i = 0; i < 14; i++) {
        //angle ranges from 45 to 135...90 is center
        let angle = randomInt(75, 105);
        let length = randomInt(2, 10) * (ship.throttle / 10);
        let x2 = x1 + Math.cos(Math.PI * angle / 180) * length;
        let y2 = y1 + Math.sin(Math.PI * angle / 180) * length;
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

function gridLookup(grid) {
    //let found = theGrid.find(({x})=> x === 10);
    return grid.x >= shipPosition.x;
}

function drawStats(fps: number) {
    let stats = [
        'FPS: ' + fps,
        'Ship Position X: ' + -Math.round(shipPosition.x),
        'Ship Position Y: ' + -Math.round(shipPosition.y),
        'Ship Angle: ' + Math.round(ship.angle),
        //'Ship Grid: ' + theGrid.find(gridLookup),
        'Grid Count: ' + gridCount,
        'Grid Rows: ' + gridRows,
        'Grid Columns: ' + gridColumns,
        'Grids Rendered: ' + gridsRendered,
        'Ship velocity: ' + ship.velocity,
        'Ship Throttle: ' + ship.throttle,
        'Rock Qty: ' + rocks.length,
        'ViewEdgeLeft: ' + viewEdgeLeft,
        'ViewEdgeRight: ' + viewEdgeRight,
        'ViewEdgeTop: ' + viewEdgeTop,
        'ViewEdgeBottom: ' + viewEdgeBottom
    ];

    let statsHeight = (stats.length + 1) * 14;
    ctx.fillStyle = 'deepskyblue';
    ctx.fillRect(0, 0, 200, statsHeight);

    ctx.textAlign = 'left';
    ctx.font = '14px Courier New';
    ctx.fillStyle = 'black';

    let textY = 14;
    stats.forEach(stat => {
        ctx.fillText(stat, 10, textY);
        textY += 14;
    });
}

function drawTranslatedObjects() {
    // to improve performance, perform one transformation for all translated (shifted) objects
    ctx.save();
    //ctx.translate((gbl_canvasWidth / 2) + shipPosition.x - (size / 2), (gbl_canvasHeight / 2) + shipPosition.y - (size / 2)); Center ship in grid
    ctx.translate((gbl_canvasWidth / 2) + shipPosition.x, (gbl_canvasHeight / 2) + shipPosition.y);

    // call drawing for translated (shifted) objects
    drawGrid();
    drawRocks();
    drawRockExplosions();
    drawRockPoints();
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

                ctx.textAlign = 'left';
                ctx.font = 'Bold 11px Courier New';
                ctx.fillStyle = 'cyan';
                ctx.fillText(element.x + '/' + element.y + ' [' + theGrid.indexOf(element) + ']', element.x * size + 10, element.y * size + 14);

                let gridX: number = element.x * size,
                    gridY: number = element.y * size;
                ctx.fillText('X: ' + gridX, element.x * size + 10, element.y * size + 26);
                ctx.fillText('Y: ' + gridY, element.x * size + 10, element.y * size + 36);
            }

            drawStars(theGridDim, index);
            gridsRendered++;
        }

        index++;
    });
}

function generateGrid(size: number) {
    // positive X / positive Y
    gridCount = 0;

    let gridWidth = theGridQty,
        gridHeight = theGridQty;

    for (let row = -gridHeight / 2; row < gridHeight / 2; row++) {
        for (let column = -gridWidth / 2; column < gridWidth / 2; column++) {
            theGrid.push({
                x: column,
                y: row,
                stars: [],
                //rocks: [],
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
    let shipThrottlePercent = ship.throttle / 100;

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
    ctx.fillText(ship.throttle + '%', gbl_canvasWidth - 20, gbl_canvasHeight - 130);
}

function generateStars(size: number) {
    theGrid.forEach(grid => {
        let starCount = Math.sqrt(size / 4);
        for (let i = 0; i < starCount; i++) {
            let twinkleChance = randomInt(0, 100),
                twinkleOn = 0;
            if (twinkleChance > 60)
                twinkleOn = 1;
            let starX = randomInt(0, size),
                starY = randomInt(0, size),
                starR = randomInt(1, 2),
                starOpacity = randomInt(1, 100), //math random generates between 0 and 1
                starTwinkle = twinkleOn,
                starTwinkleUp = Math.round(Math.random()); //generates a number less than 0.5 the result will be 0 otherwise it should be 1
            grid.stars.push({
                starX,
                starY,
                starR,
                starOpacity,
                starTwinkle,
                starTwinkleUp
            })
        }
    });
}

function generateRocks(size: number) {
    theGrid.forEach(grid => {
        //for (let count = 0; count < rockCount; count++) {

        let determine = randomInt(0, 100);  //number between 0 and 1
        if (determine >= 50) { //2% chance of a rock in a grid

            let points: any[] = [],
                centerX = randomInt(0, size) + (grid.x * theGridDim),
                centerY = randomInt(0, size) + (grid.y * theGridDim),
                radius = randomInt(10, 40),
                rotateSpeed = Math.random();

            let angle = 0;
            for (let i = 0; i < 12; i++) {
                let distance = .95 + Math.random();  // random number from 0 to .99
                let x = radius * Math.cos(angle * Math.PI / 180) * distance;
                let y = radius * Math.sin(angle * Math.PI / 180) * distance;
                points.push({
                    x,
                    y
                });
                angle += 30;
            }

            let rotationAngle = 0;
            let color = 'black'; //'dimgray';

            let rotateDir: boolean = false;
            if (Math.round(Math.random()) == 1)
                rotateDir = true;

            rocks.push({
                centerX,
                centerY,
                radius,
                points,
                rotationAngle,
                rotationCW: rotateDir,
                rotateSpeed,
                color
            });
        }
    });
}

function drawStars(size: number, index: number) {
    theGrid[index].stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255," + (star.starOpacity / 100) + ")";
        ctx.arc((theGrid[index].x * size) + star.starX, (theGrid[index].y * size) + star.starY, star.starR, 0, 360);
        ctx.fill();

        if (star.starTwinkle == 1) {
            ctx.font = 'Bold 11px Courier New';
            if (star.starTwinkleUp == 1)
                ctx.fillStyle = 'blue';
            else
                ctx.fillStyle = 'red';
            //ctx.fillText(star.starOpacity + ':' + star.starTwinkleUp, (theGrid[index].x * size) + star.starX + 20, (theGrid[index].y * size) + star.starY + 10);

            if (star.starTwinkleUp == 1) {
                star.starOpacity++;
            }
            else if (star.starTwinkleUp == 0) {
                star.starOpacity--;
            }

        }

        if (star.starTwinkle == 1) {
            if (star.starOpacity >= 99)
                star.starTwinkleUp = 0;
            else if (star.starOpacity <= 1) {
                star.starTwinkleUp = 1;
            }
        }

        /*
        ctx.textAlign = 'left';
        ctx.font = '10px Courier New';
        ctx.fillStyle = 'yellow';
        ctx.fillText('X: ' + Math.round((theGrid[index].x * size) + star.starX) + ' Y: ' + Math.round((theGrid[index].y * size) + star.starY), (theGrid[index].x * size) + star.starX + 4, (theGrid[index].y * size) + star.starY + 4);
        */
    });
}

function drawPoints() {
    /*
    //draw background
    let frameWidth = 300;
    ctx.moveTo(gbl_canvasWidth - frameWidth, 0);
    ctx.bezierCurveTo(gbl_canvasWidth - frameWidth, 0, gbl_canvasWidth - frameWidth, 40, gbl_canvasWidth - frameWidth + 40, 40);
    //ctx.lineTo(gbl_canvasHeight - frameWidth, 40);
    ctx.lineTo(gbl_canvasWidth, 40);
    ctx.lineTo(gbl_canvasWidth, 0);
    ctx.lineTo(gbl_canvasWidth - frameWidth, 0);
    ctx.fillStyle = 'yellow'
    ctx.fill();
    */

    ctx.textAlign = 'right';
    ctx.font = '40px Silkscreen';
    ctx.fillStyle = 'lime';
    ctx.fillText(addCommasToNumber(pointsTotal), gbl_canvasWidth - 20, 36);
}

function addCommasToNumber(input: number) {
    let commas = input.toLocaleString("en-US");
    return commas;
}

function drawRocks() {
    rocks.forEach(rock => {
        if (
            rock.centerX > (viewEdgeLeft - 100) &&
            rock.centerX < (viewEdgeRight + 100) &&
            rock.centerY > (viewEdgeTop - 100) &&
            rock.centerY < (viewEdgeBottom + 100)
        ) {

            ctx.save();
            //ctx.translate(300,300);
            //ctx.translate(rock.centerX + theGrid[index].x * size, rock.centerY + theGrid[index].y * size);
            ctx.translate(rock.centerX, rock.centerY);
            let rad = (rock.rotationAngle * Math.PI / 180) * rock.rotateSpeed;
            ctx.rotate(rad);

            ctx.beginPath();
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 2;
            ctx.font = 'Bold 16px Courier New';
            ctx.fillStyle = rock.color;

            // move to the first point
            ctx.moveTo(rock.points[0].x, rock.points[0].y);

            let i = 0;

            for (i = 1; i < rock.points.length - 1; i++) {
                var xc = (rock.points[i].x + rock.points[i + 1].x) / 2;
                var yc = (rock.points[i].y + rock.points[i + 1].y) / 2;
                ctx.quadraticCurveTo(rock.points[i].x, rock.points[i].y, xc, yc);
            }

            // curve through the last two points
            ctx.quadraticCurveTo(rock.points[rock.points.length - 1].x, rock.points[rock.points.length - 1].y, rock.points[0].x, rock.points[0].y);

            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = rock.color;
            ctx.fill();

            ctx.restore();

            if (rock.rotationCW)
                rock.rotationAngle++;
            else if (!rock.rotationCW)
                rock.rotationAngle--;
        }
    });
}

function collisionDetection() {
    collisionRocks();
    collisionShip();
}

function collisionRocks() {
    shotsFired.forEach(shot => {
        rocks.forEach(rock => {
            if (collisionDetect(rock, shot)) {
                generateRockExplosion(rock);
                removeRock(rock);
                removeShot(shot);
                playSoundEffect("explosion");

                pointsToDraw.push({
                    centerX: rock.centerX,
                    centerY: rock.centerY,
                    fontSize: 10,
                    duration: 0,
                    value: 20
                });
                increasePoints(20);
            }
        });
    });
};

function collisionShip() {
    rocks.forEach(rock => {
        if (collisionDetect(rock, null)) {
            generateRockExplosion(rock);
            removeRock(rock);
            ship.velocity = ship.velocity * 0.6;
            playSoundEffect("explosion");

            pointsToDraw.push({
                centerX: rock.centerX,
                centerY: rock.centerY,
                fontSize: 10,
                duration: 0,
                value: 10
            });
            increasePoints(10);
        }
    })
}

function removeRock(rock) {
    let i = rocks.indexOf(rock);
    rocks.splice(i, 1);
}

function removeShot(shot) {
    let i = shotsFired.indexOf(shot);
    shotsFired.splice(i, 1);
}

function collisionDetect(object1, object2) {
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (object2) {
        var dx = (object1.centerX) - (object2.centerX); ``
        var dy = (object1.centerY) - (object2.centerY);
    }
    else { //ship
        var dx = (object1.centerX) - (-shipPosition.x);
        var dy = (object1.centerY) - (-shipPosition.y);
    }
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= object1.radius + 10)
        return true; //collision
    else
        return false; //no collision
}

function generateRockExplosion(rock) {
    let i = rocks.indexOf(rock),
        tempAngles: any[] = [],
        tempRadius: any[] = [],
        minRadius: any = rocks[i].radius * .1,
        maxRadius: any = rocks[i].radius * .8,
        pointAngle: number;

    rocks[i].points.forEach(point => {
        tempAngles.push({ a: randomInt(0, 360) });
        tempRadius.push({ r: randomInt(minRadius, maxRadius) });
    });

    rocksExploding.push({
        centerX: rocks[i].centerX,
        centerY: rocks[i].centerY,
        radius: rocks[i].radius,
        points: rocks[i].points,
        size: rocks[i].radius,
        angles: tempAngles,
        radii: tempRadius,
        rockSize: 1,
        opacity: 0.8
    });
}

function drawRockExplosions() {
    rocksExploding.forEach(explodingRock => {
        let index = rocksExploding.indexOf(explodingRock);

        explodingRock.points.forEach(point => {
            //set fill color
            ctx.strokeStyle = "rgba(0,255,0," + explodingRock.opacity + ")";
            ctx.fillStyle = "rgba(0,255,0," + explodingRock.opacity + ")";

            let i = explodingRock.points.indexOf(point);
            let a = explodingRock.angles[i].a;
            let r = explodingRock.radii[i].r;

            let rad = a * (Math.PI / 180);

            // increment the points position
            point.x += Math.sin(rad) * 1.5;
            point.y -= Math.cos(rad) * 1.5;

            //draw filled circle
            ctx.beginPath();
            ctx.arc(point.x + explodingRock.centerX, point.y + explodingRock.centerY, r * explodingRock.rockSize, 0, 360);
            ctx.stroke();
            //ctx.fill();
        });

        //draw red filled circle
        ctx.fillStyle = "rgba(255,0,0," + explodingRock.opacity + ")";
        ctx.beginPath();
        ctx.arc(explodingRock.centerX, explodingRock.centerY, explodingRock.radius, 0, 360);
        //ctx.stroke();
        ctx.fill();

        //draw orange filled circle
        ctx.fillStyle = "rgba(255,165,0," + explodingRock.opacity + ")";
        ctx.beginPath();
        ctx.arc(explodingRock.centerX, explodingRock.centerY, explodingRock.radius * 0.6, 0, 360);
        //ctx.stroke();
        ctx.fill();

        //draw yellow filled circle
        ctx.fillStyle = "rgba(255,255,0," + explodingRock.opacity + ")";
        ctx.beginPath();
        ctx.arc(explodingRock.centerX, explodingRock.centerY, explodingRock.radius * 0.3, 0, 360);
        //ctx.stroke();
        ctx.fill();

        //draw purple filled circle
        ctx.fillStyle = "rgba(128,0,128," + explodingRock.opacity + ")";
        ctx.beginPath();
        ctx.arc(explodingRock.centerX, explodingRock.centerY, explodingRock.radius * 0.1, 0, 360);
        //ctx.stroke();
        ctx.fill();

        //draw purple traced circle
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(128,0,128," + explodingRock.opacity + ")";
        ctx.beginPath();
        ctx.arc(explodingRock.centerX, explodingRock.centerY, explodingRock.radius, 0, 360);
        ctx.stroke();

        explodingRock.opacity = explodingRock.opacity * .95;
        explodingRock.rockSize = explodingRock.rockSize * .95;
        explodingRock.radius++;
        explodingRock.size = explodingRock.size * .99;
    });
}

const pointsToDraw: {
    centerX: any,
    centerY: any,
    fontSize: number,
    duration: number,
    value: number
}[] = [];

function drawRockPoints() {
    pointsToDraw.forEach(rock => {
        ctx.textAlign = 'center';
        ctx.font = 'Bold 14px Silkscreen';
        ctx.fillStyle = 'yellow';
        ctx.fillText('+' + rock.value, rock.centerX, rock.centerY);

        rock.duration++;
    });
}

function cleanRockPoints() {
    pointsToDraw.forEach(rock => {
        let i = pointsToDraw.indexOf(rock);
        if (rock.duration > rockPointsDurationMax)
            pointsToDraw.splice(i, 1);
    });
}

function increasePoints(amount: number) {
    pointsTotal = pointsTotal + amount;
    playSoundEffect("coin");
}

function cleanup() {
    cleanupRockExplosions();
    cleanRockPoints();
}

function cleanupRockExplosions() {
    rocksExploding.forEach(explodingRock => {
        let i = rocksExploding.indexOf(explodingRock);
        if (explodingRock.size <= 2)
            rocksExploding.splice(i, 1);
    });
}