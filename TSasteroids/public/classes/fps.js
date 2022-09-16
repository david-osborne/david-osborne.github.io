let oldTimeStamp, fps;
let fpsStats = [];
export class cFPS {
    getFPS(timeStamp) {
        // Calculate the number of seconds passed since the last frame
        let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;
        // Calculate fps
        fps = Math.round(1 / secondsPassed);
        this.manageFPS(fps);
        return fps;
    }
    manageFPS(fps) {
        if (fpsStats.length >= 200) //delete oldest entry
            fpsStats.splice(0, 1);
        fpsStats.push(fps); //add new entry to array
    }
    drawFPS(ctx) {
        ctx.fillStyle = 'magenta';
        ctx.fillRect(200, 0, 400, 100);
        ctx.strokeStyle = 'black';
        fpsStats.forEach(entry => {
            let i = fpsStats.indexOf(entry);
            ctx.moveTo(400 - i, 100);
            ctx.lineTo(400 - i, 100 - entry);
            ctx.stroke();
        });
    }
}
//# sourceMappingURL=fps.js.map