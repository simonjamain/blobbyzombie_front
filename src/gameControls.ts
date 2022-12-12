import { Vector2 } from './vector2';
export class GameControls {

  public forwardAcceleration: number;
  public reverseAcceleration: number;
  public rotateHullClockwise: number;
  public rotateHullCounterClockwise: number;
  public rotateTurretClockwise: number;
  public rotateTurretCounterClockwise: number;
  private shotCallBack: () => void;

  constructor(shotCallBack:() => void) {
    this.rotateTurretClockwise = 0;
    this.rotateTurretCounterClockwise = 0;
    this.rotateHullClockwise = 0;
    this.rotateHullCounterClockwise = 0;
    this.forwardAcceleration = 0;
    this.reverseAcceleration = 0;
    this.shotCallBack = shotCallBack;

    this.initListeners();
  }

  public getAimRotation():number {
    return this.rotateTurretCounterClockwise - this.rotateTurretClockwise;
  } 

  
  public getHullRotation():number {
    return this.rotateHullCounterClockwise - this.rotateHullClockwise;
  }

  public getAcceleration():number {
    return this.forwardAcceleration - this.reverseAcceleration;
  }

  private initListeners(): void {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      switch (e.key) {
        case "q":
          this.rotateHullCounterClockwise = 1;
          break;
        case "z":
          this.forwardAcceleration = 1;
          break;
        case "d":
          this.rotateHullClockwise = 1;
          break;
        case "s":
          this.reverseAcceleration = 1;
          break;
        case "ArrowLeft":
          this.rotateTurretClockwise = 1;
          break;
        case "ArrowRight":
          this.rotateTurretCounterClockwise = 1;
          break;
        case "ArrowUp":
        case "ArrowDown":
        case " ":
          this.shotCallBack();
          break;
      }
    }, false);

    window.addEventListener("keyup", (e: KeyboardEvent) => {
      switch (e.key) {
        case "q":
          this.rotateHullCounterClockwise = 0;
          break;
        case "z":
          this.forwardAcceleration = 0;
          break;
        case "d":
          this.rotateHullClockwise = 0;
          break;
        case "s":
          this.reverseAcceleration = 0;
          break;
        case "ArrowLeft":
          this.rotateTurretClockwise = 0;
          break;
        case "ArrowRight":
          this.rotateTurretCounterClockwise = 0;
          break;
      }
    }, false);
  }
}