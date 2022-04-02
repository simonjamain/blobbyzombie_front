import { Vector2 } from './vector2';
export class GameControls {

  public left: number;
  public right: number;
  public up: number;
  public down: number;

  constructor() {
    this.left = 0;
    this.right = 0;
    this.up = 0;
    this.down = 0;

    this.initListeners();
  }

  public getMovementVector():Vector2 {
    const x = this.right - this.left;
    const y = this.down - this.up;

    return new Vector2(x, y);
  }

  private initListeners(): void {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": // left arrow
          this.left = 1;
          break;
        case "ArrowUp": // up arrow
          this.up = 1;
          break;
        case "ArrowRight": // right arrow
          this.right = 1;
          break;
        case "ArrowDown": // down arrow
          this.down = 1;
          break;
      }
    }, false);

    window.addEventListener("keyup", (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": // left arrow
          this.left = 0;
          break;
        case "ArrowUp": // up arrow
          this.up = 0;
          break;
        case "ArrowRight": // right arrow
          this.right = 0;
          break;
        case "ArrowDown": // down arrow
          this.down = 0;
          break;
      }
    }, false);
  }
}