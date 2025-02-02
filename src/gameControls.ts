export class GameControls {
  public forwardThrottle: number;
  public reverseThrottle: number;
  public rotateHullClockwise: number;
  public rotateHullCounterClockwise: number;
  public rotateTurretClockwise: number;
  public rotateTurretCounterClockwise: number;
  private shotCallBack: () => void;

  constructor(shotCallBack: () => void) {
    this.rotateTurretClockwise = 0;
    this.rotateTurretCounterClockwise = 0;
    this.rotateHullClockwise = 0;
    this.rotateHullCounterClockwise = 0;
    this.forwardThrottle = 0;
    this.reverseThrottle = 0;
    this.shotCallBack = shotCallBack;

    this.initListeners();
  }

  public getAimRotation(): number {
    return this.rotateTurretClockwise - this.rotateTurretCounterClockwise;
  }

  public getHullRotation(): number {
    return this.rotateHullClockwise - this.rotateHullCounterClockwise;
  }

  public getThrottle(): number {
    return this.forwardThrottle - this.reverseThrottle;
  }

  private initListeners(): void {
    window.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        switch (e.key) {
          case "q":
            this.rotateHullCounterClockwise = 1;
            break;
          case "z":
            this.forwardThrottle = 1;
            break;
          case "d":
            this.rotateHullClockwise = 1;
            break;
          case "s":
            this.reverseThrottle = 1;
            break;
          case "ArrowLeft":
            this.rotateTurretCounterClockwise = 1;
            break;
          case "ArrowRight":
            this.rotateTurretClockwise = 1;
            break;
          case "ArrowUp":
          case "ArrowDown":
          case " ":
            this.shotCallBack();
            break;
        }
      },
      false
    );

    window.addEventListener(
      "keyup",
      (e: KeyboardEvent) => {
        switch (e.key) {
          case "q":
            this.rotateHullCounterClockwise = 0;
            break;
          case "z":
            this.forwardThrottle = 0;
            break;
          case "d":
            this.rotateHullClockwise = 0;
            break;
          case "s":
            this.reverseThrottle = 0;
            break;
          case "ArrowLeft":
            this.rotateTurretCounterClockwise = 0;
            break;
          case "ArrowRight":
            this.rotateTurretClockwise = 0;
            break;
        }
      },
      false
    );
  }
}
