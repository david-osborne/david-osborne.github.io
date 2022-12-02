export interface iParticle {
  angle?: number;
  centerX: number;
  centerY: number;
  color?: string;
  distance?: number;
  draw?: boolean;
  duration?: number;
  flag? : boolean
  gridColumn?: number;
  gridRow?: number;
  opacity?: number;
  points?: any;
  radius?: number;
  rotateSpeed?: number;
  rotationAngle?: number;
  rotationCW?: boolean, //clockwise rotation
  throttle?: number;
  turnRate?: number;
  twinkle?: number;
  twinkleUp?: number;
  type?: any,
  velocity?: number;
  velocityMax?: number;
}