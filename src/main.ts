import {VolatileDrawableArray} from './volatileDrawableArray';
import {Player} from "./player";
import {GameControls} from "./gameControls";
import {PlayerDto} from "./dto/playerDto";
import {StatusDto} from "./dto/statusDto";
import {MultiplayerServer} from "./multiplayerServer";
import {GameStatus} from "./gameStatus";

declare global {
  interface Window { gameCanvas: HTMLCanvasElement; gameContext: CanvasRenderingContext2D;}
}



const onWhoisReceived = (player: PlayerDto) => {
  currentPlayer = Player.fromDto(player);
  window.requestAnimationFrame(update);
}

const onStatusReceived = (status: StatusDto) => {
  gameStatus = GameStatus.fromDto(status);
}

const multiplayerServer = new MultiplayerServer("http://localhost:3000", onWhoisReceived, onStatusReceived);

let currentPlayer: Player|null = null;
let gameStatus: GameStatus|null = null;

let lastFrameTimestamp :number = 0;

let gameObjects = new VolatileDrawableArray();

let gameCanvas = document.getElementById("blobbyzombie") as HTMLCanvasElement;
window.gameCanvas = gameCanvas;
let gameContext = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
window.gameContext = gameContext;
/**
 * Pixels per meters
 */
let scale = 30;
const gameControls = new GameControls(shoot);

function shoot() {
  if(currentPlayer === null) return;
  gameObjects.push(currentPlayer.shoot());
}


function update(timestamp: DOMHighResTimeStamp) {
  if(currentPlayer === null) return;

  const deltaTimeSeconds = (timestamp - lastFrameTimestamp) / 1000;

  gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  gameContext.scale(scale, scale);

  multiplayerServer.sendPosition({
    position: {
      x: currentPlayer.getPosition().x,
      y: currentPlayer.getPosition().y
    },
    aimingAngleRad: currentPlayer.getAimingAngleRad()
  })

  currentPlayer.update(
    deltaTimeSeconds,
      gameControls.getMovementVector(),
    gameControls.getAimRotation()
    )

  if(gameStatus !== null && currentPlayer !== null) {
    gameStatus?.getPlayerList()?.filter(p => p.getId() !== currentPlayer?.getId()).forEach((p :Player) => p.draw(gameContext));
    currentPlayer.draw(gameContext);
  }

  gameObjects.draw(gameContext);

  window.requestAnimationFrame(update);
  lastFrameTimestamp = timestamp;
  gameContext.setTransform(1, 0, 0, 1, 0, 0);
}

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
        
function resizeCanvas() {
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
}


resizeCanvas();