import 'phaser';

export class MenuScene extends Phaser.Scene {

  private gameState = null;

  constructor() {
    super({
      key: 'InfestationScene'
    });
  }

  init(data) {
		if (this?.exNihilo)
    {
      delete this.exNihilo;
    }

    this.exNihilo = new ExNihilo();
    document.exNihilo = this.exNihilo;
    this.exNihilo.init({
      scene: this,
      w: gameSettings.grid.nbCol,
      h: gameSettings.grid.nbRow
    });
    this.input.mouse.disableContextMenu();
    this.sys.canvas.style.cursor = "none";
  }

  preload(): void {
  }

  create(): void {
  }

  update(): void {
  }
}