import { functions } from './functions.js';
const csFunctions = new functions;
export class cStars {
    //stars: iParticle[] = [];
    generateStars(theGrid, gridDim) {
        let starCount = Math.sqrt(gridDim / 4);
        theGrid.forEach(grid => {
            for (let i = 0; i < starCount; i++) {
                let twinkleChance = csFunctions.randomInt(0, 100), twinkleOn = 0;
                if (twinkleChance > 60)
                    twinkleOn = 1;
                let starX = csFunctions.randomInt(0, gridDim), starY = csFunctions.randomInt(0, gridDim), starR = csFunctions.randomInt(1, 2), starOpacity = csFunctions.randomInt(1, 100), //math random generates between 0 and 1
                starTwinkle = twinkleOn, starTwinkleUp = Math.round(Math.random()), //generates a number less than 0.5 the result will be 0 otherwise it should be 1
                starDraw = true;
                grid.stars.push({
                    centerX: starX,
                    centerY: starY,
                    radius: starR,
                    opacity: starOpacity,
                    twinkle: starTwinkle,
                    twinkleUp: starTwinkleUp,
                    draw: starDraw
                });
            }
        });
    }
    // updateStars(viewEdgeLeft: number, viewEdgeTop: number, viewEdgeRight: number, viewEdgeBottom: number) {
    //   let starDrawCount: number = 0;
    //   this.stars.forEach(star => {
    //     if (
    //       star.centerX >= viewEdgeLeft &&
    //       star.centerX <= viewEdgeRight &&
    //       star.centerY >= viewEdgeTop &&
    //       star.centerY <= viewEdgeBottom
    //     ) {
    //       star.draw = true;
    //       starDrawCount++;
    //     }
    //   });
    //   console.log(starDrawCount.toString() + "/" + this.stars.length.toString());
    // }
    drawStars(ctx, theGrid, gridDim, gridIndex, gridX, gridY) {
        theGrid[gridIndex].stars.forEach(star => {
            ctx.beginPath();
            ctx.fillStyle = "rgba(255,255,255," + (star.opacity / 100) + ")";
            ctx.arc(star.centerX + (gridX * gridDim), star.centerY + (gridY * gridDim), star.radius, 0, 360);
            ctx.fill();
            if (star.twinkle == 1) {
                ctx.font = 'Bold 11px Courier New';
                if (star.twinkleUp == 1)
                    ctx.fillStyle = 'blue';
                else
                    ctx.fillStyle = 'red';
                //ctx.fillText(star.starOpacity + ':' + star.starTwinkleUp, (theGrid[index].x * size) + star.starX + 20, (theGrid[index].y * size) + star.starY + 10);
                if (star.twinkleUp == 1) {
                    star.opacity++;
                }
                else if (star.twinkleUp == 0) {
                    star.opacity--;
                }
            }
            if (star.twinkle == 1) {
                if (star.opacity >= 99)
                    star.twinkleUp = 0;
                else if (star.opacity <= 1) {
                    star.twinkleUp = 1;
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
}
//# sourceMappingURL=stars.js.map