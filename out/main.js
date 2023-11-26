var gbl_canvasWidth = window.innerWidth, gbl_canvasHeight = window.innerHeight, gbl_meltTime = 2000, cvs, ctx, secondsPassed, oldTimeStamp, fps = 0, gbl_particleCount = 0, gbl_timestampStart, gbl_imageX = [], gbl_imageY = [], flakes = [], image = [], clouds = [];
window.onload = init;
function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');
    var startTime = new Date;
    gbl_timestampStart = startTime;
    createEventListeners();
    gbl_imageX[1] = gbl_canvasWidth + 200;
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
    flakes = [];
}
function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    clearCanvas();
    if (fps >= 60)
        generateArrays();
    drawText(fps);
    drawSleigh();
    drawElf();
    draw();
    iterateArrays();
    cleanArrays();
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
    ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}
function generateArrays() {
    var randomColor = '#' + Math.random().toString(16).substr(2, 6);
    flakes.push({
        color: randomColor,
        posX: randomInt(0, gbl_canvasWidth),
        posY: randomInt(0, (gbl_canvasHeight * 0.3)),
        xShift: randomInt(100, 200),
        xDelta: 0,
        xDir: randomInt(1, 3),
        radius: randomInt(2, 4),
        opacity: Math.random() + 0.3, //math random generates between 0 and 1, sets min at 0.3
        velY: randomInt(5, 25) / 10, //results in 0.3 to 1.0
        velX: randomInt(1, 10) / 100, //results in 0.01 to 0.1
        meltTime: 0,
        type: randomInt(1, 100)
    });
}
function draw() {
    //draw particle for each array item
    for (var i = 0; i < flakes.length; i++) {
        var flake = flakes[i]; //get the flake from flakes
        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        //draw filled circle
        ctx.beginPath();
        ctx.arc(flake.posX, flake.posY, flake.radius, 0, 360);
        ctx.fill();
    }
}
function drawSleigh() {
    if (!image[0]) {
        var imgSleigh = new Image();
        imgSleigh.src = 'img/sleigh.png';
        image[0] = imgSleigh;
    }
    var imgW = 300, imgH = 144;
    gbl_imageY[0] = 100;
    if (gbl_imageX[0] < gbl_canvasWidth)
        gbl_imageX[0]++;
    else
        gbl_imageX[0] = 0 - imgW;
    ctx.drawImage(image[0], gbl_imageX[0], gbl_imageY[0], imgW, imgH);
}
function drawElf() {
    if (!image[1]) {
        var imgElf = new Image();
        imgElf.src = 'img/elf.png';
        image[1] = imgElf;
    }
    var imgW = 154, imgH = 355;
    gbl_imageY[1] = gbl_canvasHeight - (imgH / 2);
    if (gbl_imageX[1] > (0 - imgW))
        gbl_imageX[1] -= 1.5;
    else
        gbl_imageX[1] = gbl_canvasWidth;
    ctx.drawImage(image[1], gbl_imageX[1], gbl_imageY[1], imgW, imgH);
}
function iterateArrays() {
    for (var i = 0; i < flakes.length; i++) {
        var flake = flakes[i];
        if (flake.posY < (gbl_canvasHeight - flake.radius)) {
            flake.posY += flake.velY;
            //move random fast flakes
            if (flake.type == 1) {
                flake.posX += flake.velX + 1;
                flake.posY += 2;
            }
            else if (flake.xDir != 1) {
                if (flake.xDelta < flake.xShift) {
                    switch (flake.xDir) {
                        case 2:
                            flake.posX += flake.velX;
                            flake.xDelta++;
                            break;
                        case 3:
                            flake.posX -= flake.velX;
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
        else {
            flake.meltTime++;
        }
    }
}
function cleanArrays() {
    for (var i = 0; i < flakes.length; i++) {
        var flake = flakes[i];
        if (flake.posY > gbl_canvasHeight
            ||
                flake.posY < 0
            ||
                flake.posX > gbl_canvasWidth
            ||
                flake.posX < 0
            ||
                flake.meltTime >= gbl_meltTime) {
            flakes.splice(i, 1);
        }
    }
}
function drawText(fps) {
    var d1 = new Date(), d2 = new Date();
    d2.setMonth(11);
    d2.setDate(25);
    d2.setFullYear(d1.getFullYear());
    console.log(d2);
    var hh = d1.getHours().toString();
    var mm = d1.getMinutes().toString();
    var ss = d1.getSeconds().toString();
    var ms = d1.getMilliseconds().toString();
    var dateDiff = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)); //https://stackoverflow.com/questions/7763327/how-to-calculate-date-difference-in-javascript
    /*
    ctx.textAlign = 'left';
    ctx.font = '24px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText('FPS: ' + fps, 10, gbl_canvasHeight - 40);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText('Particles: ' + flakes.length.toString(), 10, gbl_canvasHeight - 20);
*/
    ctx.font = 'bold 64px verdana';
    ctx.fillStyle = 'limegreen';
    ctx.textAlign = 'center';
    //ctx.fillText(dateDiff + ' days until Christmas', gbl_canvasWidth / 2, gbl_canvasHeight / 2);
    ctx.strokeStyle = 'darkred';
    ctx.lineWidth = 2;
    ctx.strokeText(dateDiff + ' days until Christmas ' + d2.getFullYear().toString(), gbl_canvasWidth / 2, gbl_canvasHeight / 2);
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//# sourceMappingURL=main.js.map