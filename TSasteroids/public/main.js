//https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html
// in order to allow use of modules and multiple code files, when running locally, and not on a web server, must use the below chrome startup flag:
//C:\ ... \Application\chrome.exe --allow-file-access-from-files
//game structure
//  init
//  load
//  update
//  draw
//kickoff the game
window.onload = init;
//import must exist at highest code level
import { playSoundEffect } from './classes/audio.js';
import { playSong } from './classes/audio.js';
import { cFPS } from './classes/fps.js';
const csFPS = new cFPS;
import { cRocks } from './classes/rocks.js';
const csRocks = new cRocks;
import { cStars } from './classes/stars.js';
const csStars = new cStars;
import { functions } from './classes/functions.js';
const csFunctions = new functions;
import { cGrid } from './classes/grid.js';
const csGrid = new cGrid;
import { cShip } from './classes/ship.js';
const csShip = new cShip;
//globals
let gbl_canvasWidth = window.innerWidth, gbl_canvasHeight = window.innerHeight, cvs, ctx, gbl_timestampStart, 
//worldSizeX: number = 0,
//worldSizeY: number = 0,
showStats = true, showMouse = true, shotsFired = [], shotVelocity = 6, shotDuration = 100, shotEnabled = true, shotInterval = 400, gbl_mouseX = 0, gbl_mouseY = 0, gbl_mouseAngle = 0, gbl_mouseDown = false, rocksExploding = [], viewEdgeLeft, viewEdgeRight, viewEdgeTop, viewEdgeBottom, rockPointsDurationMax = 50, pointsTotal = 0, theGridDim = 20000;
let rocks = [];
//let flameParticle: iParticle[] = [];
let burstParticle = [];
function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');
    csShip.initShip();
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
    csGrid.generateGrid();
    csRocks.generateRocks(csGrid.theGrid, csGrid.theGridDim);
    console.log(csGrid.theGrid.length + "/" + csGrid.theGridDim);
    setInterval(updateVelocity, 200);
    //init sounds
    //playSoundEffect("explosion");
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
    csShip.ship.throttle += e.deltaY * -0.1;
    //restrict shipThrottle between min and max
    csShip.ship.throttle = Math.min(Math.max(0, csShip.ship.throttle), 100);
}
function mouseMove(e) {
    var rect = cvs.getBoundingClientRect(); //get canvas boundries
    gbl_mouseX = e.clientX - rect.left; //get mouse X pos, set to global
    gbl_mouseY = e.clientY - rect.top; //get mouse Y pos, set to global
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
    csShip.ship.angle = gbl_mouseAngle + 90;
}
function keyDown(e) {
    switch (e.code) {
        //left
        case "KeyA":
        case "ArrowLeft":
            csShip.ship.angle = csShip.ship.angle - 6;
            //shipAngle -= shipTurnRate;
            break;
        //right
        case "KeyD":
        case "ArrowRight":
            csShip.ship.angle = csShip.ship.angle + 6;
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
            if (csGrid.showGrid == true)
                csGrid.showGrid = false;
            else if (csGrid.showGrid == false)
                csGrid.showGrid = true;
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
function updateThrottle(action) {
    if (action == 'up') {
        if (csShip.ship.throttle <= 90)
            csShip.ship.throttle += 10;
    }
    if (action == 'down') {
        if (csShip.ship.throttle >= 10)
            csShip.ship.throttle -= 10;
    }
    if (action == 'kill') {
        csShip.ship.throttle = 0;
    }
}
function updateVelocity() {
    let targetVelocity = Math.round((csShip.ship.throttle / 100) * csShip.ship.velocityMax);
    if (csShip.ship.velocity < targetVelocity)
        csShip.ship.velocity++;
    if (csShip.ship.velocity > targetVelocity)
        csShip.ship.velocity--;
}
function shipMovement() {
    csShip.ship.velocity = Math.round(csShip.ship.velocity);
    let rad = csShip.ship.angle * (Math.PI / 180);
    csShip.ship.centerX += Math.sin(rad) * -csShip.ship.velocity;
    csShip.ship.centerY -= Math.cos(rad) * -csShip.ship.velocity;
}
function fireShot() {
    if (shotEnabled == true) {
        setTimeout(shotTimer, shotInterval);
        shotEnabled = false;
        shotsFired.push({
            centerX: -csShip.ship.centerX,
            centerY: -csShip.ship.centerY,
            angle: csShip.ship.angle,
            duration: 0,
            radius: 2,
            shotVelocity: csShip.ship.velocity + shotVelocity,
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
    clearCanvas();
    determineViewBoundries();
    //update
    //csStars.updateStars(viewEdgeLeft, viewEdgeTop, viewEdgeRight, viewEdgeBottom);
    csShip.generateFlameParticles(csShip.ship.centerX, csShip.ship.centerY);
    csShip.moveParticles();
    //draw
    drawTranslatedObjects();
    csShip.drawShip(ctx, gbl_canvasWidth / 2, gbl_canvasHeight / 2);
    shipMovement();
    if (gbl_mouseDown)
        fireShot();
    if (showStats)
        drawStats(timeStamp);
    drawshipThrottle();
    if (showMouse)
        //drawMouseLine();
        drawMouseCrosshairs();
    //drawMouseCircle();
    collisionDetection();
    cleanup();
    drawPoints();
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}
function determineViewBoundries() {
    // determine bounding view box
    viewEdgeLeft = -Math.round(csShip.ship.centerX + (gbl_canvasWidth / 2));
    viewEdgeRight = -Math.round(csShip.ship.centerX - (gbl_canvasWidth / 2));
    viewEdgeTop = -Math.round(csShip.ship.centerY + (gbl_canvasHeight / 2));
    viewEdgeBottom = -Math.round(csShip.ship.centerY - (gbl_canvasHeight / 2));
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
function getDistance(x1, y1, x2, y2) {
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
    let mousePosX = Math.round((gbl_canvasWidth / 2) - gbl_mouseX + csShip.ship.centerX), mousePosY = Math.round((gbl_canvasHeight / 2) - gbl_mouseY + csShip.ship.centerY);
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
function gridLookup(grid) {
    //let found = theGrid.find(({x})=> x === 10);
    return grid.x >= csShip.ship.centerX;
}
function drawStats(timestamp) {
    let stats = [
        'FPS: ' + csFPS.getFPS(timestamp),
        'Ship Position X: ' + -Math.round(csShip.ship.centerX),
        'Ship Position Y: ' + -Math.round(csShip.ship.centerY),
        'Ship Angle: ' + Math.round(csShip.ship.angle),
        //'Ship Grid: ' + theGrid.find(gridLookup),
        'Grid Count: ' + csGrid.gridCount,
        'Grid Rows: ' + csGrid.gridRows,
        'Grid Columns: ' + csGrid.gridColumns,
        'Grids Rendered: ' + csGrid.gridsRendered,
        'Ship velocity: ' + csShip.ship.velocity,
        'Ship Throttle: ' + csShip.ship.throttle,
        'Rock Qty: ' + csRocks.rockCount,
        'ViewEdgeLeft: ' + viewEdgeLeft,
        'ViewEdgeRight: ' + viewEdgeRight,
        'ViewEdgeTop: ' + viewEdgeTop,
        'ViewEdgeBottom: ' + viewEdgeBottom,
        'FlameParticles: ' + csShip.flameParticles.length
    ];
    let statsHeight = (stats.length + 1) * 14;
    ctx.fillStyle = 'deepskyblue';
    ctx.fillRect(0, 40, 200, statsHeight);
    ctx.textAlign = 'left';
    ctx.font = '14px Courier New';
    ctx.fillStyle = 'black';
    let textY = 14 + 40;
    stats.forEach(stat => {
        ctx.fillText(stat, 10, textY);
        textY += 14;
    });
    csFPS.manageFPS(ctx, timestamp);
}
function drawTranslatedObjects() {
    // to improve performance, perform one transformation for all translated (shifted) objects
    ctx.save();
    //ctx.translate((gbl_canvasWidth / 2) + ship.centerX - (size / 2), (gbl_canvasHeight / 2) + ship.centerY - (size / 2)); Center ship in grid
    ctx.translate((gbl_canvasWidth / 2) + csShip.ship.centerX, (gbl_canvasHeight / 2) + csShip.ship.centerY);
    // call drawing for translated (shifted) objects
    //csStars.drawStars(ctx);
    csGrid.drawGrid(ctx, csShip.ship.centerX, csShip.ship.centerY, gbl_canvasWidth, gbl_canvasHeight);
    csShip.drawParticles(ctx);
    csRocks.drawRocks(ctx, viewEdgeLeft, viewEdgeRight, viewEdgeTop, viewEdgeBottom);
    csRocks.drawRockExplosions(ctx);
    drawRockPoints();
    drawShots();
    ctx.restore();
}
function drawshipThrottle() {
    let shipThrottlePercent = csShip.ship.throttle / 100;
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
    ctx.fillText(csShip.ship.throttle + '%', gbl_canvasWidth - 20, gbl_canvasHeight - 130);
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
function addCommasToNumber(input) {
    let commas = input.toLocaleString("en-US");
    return commas;
}
function collisionDetection() {
    collisionRocks();
    collisionShip();
}
function collisionRocks() {
    shotsFired.forEach(shot => {
        this.rocks.forEach(rock => {
            if (collisionDetect(rock, shot)) {
                csRocks.generateRockExplosion(rock);
                csRocks.removeRock(rock);
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
}
;
function collisionShip() {
    csRocks.rocks.forEach(rock => {
        if (collisionDetect(rock, null)) {
            csRocks.generateRockExplosion(rock);
            csRocks.removeRock(rock);
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
    });
}
function removeShot(shot) {
    let i = shotsFired.indexOf(shot);
    shotsFired.splice(i, 1);
}
function collisionDetect(object1, object2) {
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (object2) {
        var dx = (object1.centerX) - (object2.centerX);
        ``;
        var dy = (object1.centerY) - (object2.centerY);
    }
    else { //ship
        var dx = (object1.centerX) - (-csShip.ship.centerX);
        var dy = (object1.centerY) - (-csShip.ship.centerY);
    }
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= object1.radius + 10)
        return true; //collision
    else
        return false; //no collision
}
const pointsToDraw = [];
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
function increasePoints(amount) {
    pointsTotal = pointsTotal + amount;
    playSoundEffect("coin");
}
function cleanupRockExplosions() {
    rocksExploding.forEach(explodingRock => {
        let i = rocksExploding.indexOf(explodingRock);
        if (explodingRock.size <= 2)
            rocksExploding.splice(i, 1);
    });
}
function cleanup() {
    cleanupRockExplosions();
    cleanRockPoints();
    csShip.cleanParticles();
}
//# sourceMappingURL=main.js.map