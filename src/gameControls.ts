import { Vector2 } from './vector2';
export class GameControls {

  public moveLeft: number;
  public moveRight: number;
  public moveUp: number;
  public moveDown: number;
  public rotateTurretClockwise: number;
  public rotateTurretCounterClockwise: number;
  private shotCallBack: () => void;

  constructor(shotCallBack:() => void) {
    this.moveLeft = 0;
    this.moveRight = 0;
    this.moveUp = 0;
    this.moveDown = 0;
    this.rotateTurretClockwise = 0;
    this.rotateTurretCounterClockwise = 0;
    this.shotCallBack = shotCallBack;

    this.initListeners();
  }

  public getMovementVector():Vector2 {
    const x = this.moveRight - this.moveLeft;
    const y = this.moveDown - this.moveUp;

    return new Vector2(x, y);
  }

  public getAimRotation():number {
    return this.rotateTurretCounterClockwise - this.rotateTurretClockwise;
  } 

  private initListeners(): void {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      switch (e.key) {
        case "q":
          this.moveLeft = 1;
          break;
        case "z":
          this.moveUp = 1;
          break;
        case "d":
          this.moveRight = 1;
          break;
        case "s":
          this.moveDown = 1;
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
          this.moveLeft = 0;
          break;
        case "z":
          this.moveUp = 0;
          break;
        case "d":
          this.moveRight = 0;
          break;
        case "s": // down arrow
          this.moveDown = 0;
          break;
        case "ArrowLeft": // right arrow
          this.rotateTurretClockwise = 0;
          break;
        case "ArrowRight": // down arrow
          this.rotateTurretCounterClockwise = 0;
          break;
      }
    }, false);
  }
}