export interface iParticle {
  centerX: number;
  centerY: number;
  radius?: number;
  points?: any;
  rotationAngle?: number;
  rotationCW?: boolean, //clockwise rotation
  rotateSpeed?: number;
  color?: string;
  angle?: number;
  duration?: number;
  gridRow?: number;
  gridColumn?: number;
  velocity?: number;
  velocityMax?: number;
  turnRate?: number;
  throttle?: number;
  draw?: boolean;
  opacity?: number;
  twinkle?: number;
  twinkleUp?: number;
}