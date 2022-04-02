import { Vector2 } from './vector2';
export class GameControls {

  public moveLeft: number;
  public moveRight: number;
  public moveUp: number;
  public moveDown: number;
  public rotateTurretClockwise: number;
  public rotateTurretCounterClockwise: number;

  constructor() {
    this.moveLeft = 0;
    this.moveRight = 0;
    this.moveUp = 0;
    this.moveDown = 0;
    this.rotateTurretClockwise = 0;
    this.rotateTurretCounterClockwise = 0;

    this.initListeners();
  }

  public getMovementVector():Vector2 {
    const x = this.moveRight - this.moveLeft;
    const y = this.moveDown - this.moveUp;

    return new Vector2(x, y);
  }

  public getAimRotation():number {
    return this.rotateTurretClockwise - this.rotateTurretCounterClockwise;
  } 

  private initListeners(): void {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": // left arrow
          this.moveLeft = 1;
          break;
        case "ArrowUp": // up arrow
          this.moveUp = 1;
          break;
        case "ArrowRight": // right arrow
          this.moveRight = 1;
          break;
        case "ArrowDown": // down arrow
          this.moveDown = 1;
          break;
        case "d": // right arrow
          this.rotateTurretClockwise = 1;
          break;
        case "q": // down arrow
          this.rotateTurretCounterClockwise = 1;
          break;
      }
    }, false);

    window.addEventListener("keyup", (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": // left arrow
          this.moveLeft = 0;
          break;
        case "ArrowUp": // up arrow
          this.moveUp = 0;
          break;
        case "ArrowRight": // right arrow
          this.moveRight = 0;
          break;
        case "ArrowDown": // down arrow
          this.moveDown = 0;
          break;
        case "d": // right arrow
          this.rotateTurretClockwise = 0;
          break;
        case "q": // down arrow
          this.rotateTurretCounterClockwise = 0;
          break;
      }
    }, false);
  }
}