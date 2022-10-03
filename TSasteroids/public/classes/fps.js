let oldTimeStamp, fps = 0, fpsMin = 0, fpsMax = 0, fpsFirstRun = true;
export class cFPS {
    getFPS(timeStamp) {
        // Calculate the number of seconds passed since the last frame
        let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;
        // Calculate fps
        let x = Math.round(1 / secondsPassed);
        fps = +x; //uranary parse to number
    }
    manageFPS(ctx, timestamp) {
        //update the FPS
        this.getFPS(timestamp);
        if (fpsFirstRun && fps != 0) {
            fpsMin = fps;
            fpsMax = fps;
            fpsFirstRun = false;
        }
        //draw FPS
        this.drawFPS(ctx);
    }
    drawFPS(ctx) {
        ctx.fillStyle = "rgba(255,255,255, 0.4)";
        ctx.fillRect(0, 0, 100, 30);
        ctx.textAlign = 'left';
        ctx.font = 'Bold 16px Courier New';
        ctx.fillStyle = 'white';
        ctx.fillText('FPS: ' + fps.toString(), 10, 20);
    }
}
//# sourceMappingURL=fps.js.map