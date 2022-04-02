import {VolatileDrawableArray} from './volatileDrawableArray';
import {Player} from "./player";
import {GameControls} from "./gameControls";
import {PlayerDto} from "./dto/playerDto";
import {StatusDto} from "./dto/statusDto";
import {MultiplayerServer} from "./multiplayerServer";
import {Vector3} from "./vector3";
import {Vector2} from "./vector2";

declare global {
  interface Window { gameCanvas: HTMLCanvasElement; gameContext: CanvasRenderingContext2D;}
}

new MultiplayerServer("http://localhost:3000", onWhoisReceived, onStatusReceived);

let currentPlayer: Player|null = null;

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

  currentPlayer.update(
    deltaTimeSeconds,
    gameControls.getMovementVector(), 
    gameControls.getAimRotation()
    )
  currentPlayer.draw(gameContext);
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

function onWhoisReceived (playerDto: PlayerDto) {

  currentPlayer = new Player(Vector2.fromDto(playerDto.position), playerDto.aimingAngleRad, Vector3.fromDto(playerDto.color));
  window.requestAnimationFrame(update);
}
function onStatusReceived (statusDto: StatusDto) {
  if(currentPlayer === null) return;


}

resizeCanvas();