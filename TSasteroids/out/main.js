var gbl_canvasWidth = window.innerWidth, gbl_canvasHeight = window.innerHeight, cvs, ctx, secondsPassed, oldTimeStamp, fps = 0, gbl_timestampStart, shipAngle = 0, shipPosX, shipPosY, theGrid = [];
window.onload = init;
function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');
    //scaleCanvas();
    var startTime = new Date;
    gbl_timestampStart = startTime;
    createEventListeners();
    shipPosX = gbl_canvasWidth / 2;
    shipPosY = gbl_canvasHeight / 2;
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
function createEventListeners() {
    document.addEventListener('keydown', keyDown);
}
function keyDown(e) {
    var rotateSpeed = 1;
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
    var body = document.getElementById('body');
    var canvas = document.createElement('canvas');
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
    // set line stroke and line width
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.save();
    var rad = shipAngle * Math.PI / 180;
    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(12, 20);
    ctx.lineTo(0, 10);
    ctx.lineTo(-12, 20);
    ctx.lineTo(0, -20);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, -1200);
    ctx.strokeStyle = 'magenta';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}
function drawFPS(fps) {
    ctx.textAlign = 'left';
    ctx.font = '24px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('FPS: ' + fps, 10, gbl_canvasHeight - 40);
}
function drawGrid(x, y, size) {
    ctx.strokeStyle = 'red';
    theGrid.forEach(function (grid) {
        ctx.beginPath();
        ctx.rect(x, y, x + size, y + size);
        ctx.stroke();
    });
}
//# sourceMappingURL=main.js.map