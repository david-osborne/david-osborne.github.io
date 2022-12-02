import { cStars } from "./stars.js";
const csStars = new cStars;
export class cGrid {
    constructor() {
        this.theGrid = [];
        this.theGridDim = 400; //square pixel size of each grid
        this.theGridQty = 500; //the size of the total grid
        this.gridCount = 0;
        this.gridRows = 0;
        this.gridColumns = 0;
        this.gridsRendered = 0;
        this.showGrid = false;
    }
    generateGrid() {
        // positive X / positive Y
        let gridWidth = this.theGridQty, //total grid height
        gridHeight = this.theGridQty; //total grid width
        for (let row = -gridHeight / 2; row < gridHeight / 2; row++) {
            for (let column = -gridWidth / 2; column < gridWidth / 2; column++) {
                this.theGrid.push({
                    x: column,
                    y: row,
                    stars: [],
                    //rocks: [],
                    opacity: Math.random() + 0.3, //math random generates between 0 and 1, sets min at 0.3
                });
            }
            this.gridRows++;
            this.gridCount++;
        }
        this.gridColumns = gridWidth;
        this.gridCount = this.gridRows * this.gridColumns;
        csStars.generateStars(this.theGrid, this.theGridDim);
    }
    drawGrid(ctx, offsetX, offsetY, canvasWidth, canvasHeight) {
        let size = this.theGridDim;
        let index = 0;
        this.gridsRendered = 0;
        this.theGrid.forEach(element => {
            if (
            //columns
            (element.x * size) + offsetX >= ((0 - size) - (canvasWidth / 2))
                &&
                    (element.x * size) + offsetX <= (canvasWidth / 2) + size
                &&
                    //rows
                    (element.y * size) + offsetY >= ((0 - size) - (canvasHeight / 2))
                &&
                    (element.y * size) + offsetY <= (canvasHeight / 2)) {
                if (this.showGrid == true) {
                    ctx.strokeStyle = 'dimgray';
                    ctx.strokeRect(element.x * size, element.y * size, size, size);
                    ctx.textAlign = 'left';
                    ctx.font = 'Bold 11px Courier New';
                    ctx.fillStyle = 'cyan';
                    ctx.fillText(element.x + '/' + element.y + ' [' + this.theGrid.indexOf(element) + ']', element.x * size + 10, element.y * size + 14);
                    let gridX = element.x * size, gridY = element.y * size;
                    ctx.fillText('X: ' + gridX, element.x * size + 10, element.y * size + 26);
                    ctx.fillText('Y: ' + gridY, element.x * size + 10, element.y * size + 36);
                }
                csStars.drawStars(ctx, this.theGrid, this.theGridDim, this.theGrid.indexOf(element), element.x, element.y);
                this.gridsRendered++;
            }
            index++;
        });
    }
}
//# sourceMappingURL=grid.js.map