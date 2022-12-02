import { functions } from './functions.js';
const csFunctions = new functions;
export class cShip {
    constructor() {
        this.timeAccumulator = 0;
        this.ship = {
            centerX: 0,
            centerY: 0,
            angle: 0,
            gridRow: 0,
            gridColumn: 0,
            velocity: 0,
            velocityMax: 10,
            turnRate: 0,
            throttle: 30
        };
        this.flameParticles = [];
    }
    initShip() {
        this.lastTimeStamp = Date.now();
    }
    drawShip(ctx, x, y) {
        //ctx.imageSmoothingEnabled = true;
        //ctx.imageSmoothingQuality = "high";
        ctx.save();
        let rad = this.ship.angle * Math.PI / 180;
        ctx.translate(x, y);
        ctx.rotate(rad);
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
    generateFlameParticles(x, y) {
        if (this.ship.throttle > 0) {
            this.addParticle(x, y, this.ship.throttle);
        }
    }
    addParticle(x, y, throttle) {
        this.flameParticles.push({
            centerX: this.ship.centerX,
            centerY: this.ship.centerY,
            radius: 6,
            angle: csFunctions.randomInt(-55, 55) + this.ship.angle,
            velocity: Math.random(),
            distance: throttle,
            draw: true,
            duration: 0,
            opacity: .8
        });
    }
    moveParticles() {
        this.flameParticles.forEach(particle => {
            let rad = particle.angle * (Math.PI / 180);
            // increment the shot position
            particle.centerX += Math.sin(rad); // * particle.velocity;
            particle.centerY -= Math.cos(rad); // * particle.velocity;
            particle.distance--;
            particle.duration++;
            if (particle.radius > .3)
                particle.radius = particle.radius - 0.2;
        });
    }
    drawParticles(ctx) {
        this.flameParticles.forEach(particle => {
            ctx.beginPath();
            ctx.fillStyle = "rgba(" + csFunctions.colorNames(particle.duration) + ", " + particle.opacity.toString() + ")";
            ctx.arc(-particle.centerX, -particle.centerY, particle.radius, 0, 360);
            ctx.fill();
            ctx.strokeStyle = 'magenta';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }
    cleanParticles() {
        this.flameParticles.forEach(particle => {
            let i = this.flameParticles.indexOf(particle);
            if (particle.duration >= 100)
                this.flameParticles.splice(i, 1);
        });
    }
}
//# sourceMappingURL=ship.js.map