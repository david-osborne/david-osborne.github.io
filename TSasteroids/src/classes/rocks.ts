import { functions} from './functions.js'
const csFunctions: functions = new functions;
import { cGrid } from './grid.js'
const csGrid: cGrid = new cGrid;

export class cRocks {

  rocks: any[] = [];
  rocksExploding: any[] = [];

  generateRocks(size: number) {
    csGrid.theGrid.forEach(grid => {
      //for (let count = 0; count < rockCount; count++) {

      let determine = csFunctions.randomInt(0, 100);  //number between 0 and 1
      if (determine >= 50) { //2% chance of a rock in a grid

        let points: any[] = [],
          centerX = csFunctions.randomInt(0, size) + (grid.x * csGrid.theGridDim),
          centerY = csFunctions.randomInt(0, size) + (grid.y * csGrid.theGridDim),
          radius = csFunctions.randomInt(10, 40),
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

        this.rocks.push({
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

  drawRocks(ctx: any, viewEdgeLeft: number, viewEdgeRight: number, viewEdgeTop: number, viewEdgeBottom: number) {
    this.rocks.forEach(rock => {
      if (
        rock.centerX > (viewEdgeLeft - 100) &&
        rock.centerX < (viewEdgeRight + 100) &&
        rock.centerY > (viewEdgeTop - 100) &&
        rock.centerY < (viewEdgeBottom + 100)
      ) {

        ctx.save();

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

  removeRock(rock) {
    let i = this.rocks.indexOf(rock);
    this.rocks.splice(i, 1);
  }

  generateRockExplosion(rock) {
    let i = this.rocks.indexOf(rock),
      tempAngles: any[] = [],
      tempRadius: any[] = [],
      minRadius: any = this.rocks[i].radius * .1,
      maxRadius: any = this.rocks[i].radius * .8,
      pointAngle: number;

    this.rocks[i].points.forEach(point => {
      tempAngles.push({ a: csFunctions.randomInt(0, 360) });
      tempRadius.push({ r: csFunctions.randomInt(minRadius, maxRadius) });
    });

    this.rocksExploding.push({
      centerX: this.rocks[i].centerX,
      centerY: this.rocks[i].centerY,
      radius: this.rocks[i].radius,
      points: this.rocks[i].points,
      size: this.rocks[i].radius,
      angles: tempAngles,
      radii: tempRadius,
      rockSize: 1,
      opacity: 0.8
    });
  }

  drawRockExplosions(ctx: any) {
    this.rocksExploding.forEach(explodingRock => {
      let index = this.rocksExploding.indexOf(explodingRock);

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
}