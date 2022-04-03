import { HitDto } from './dto/hitDto';
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

let url: string = "https://api.glop.legeay.dev";
// url = "http://localhost:3000";

const multiplayerServer = new MultiplayerServer(url, onWhoisReceived, onStatusReceived);

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
  if(gameStatus === null) return;
  if(currentPlayer === null) return;

  gameObjects.push(currentPlayer.shoot(gameStatus.getPlayerListExceptUs(currentPlayer.getId()), hit));
}

function hit(victim:Player, shotAngleRad:number) {
  const hitEvent:HitDto = {
    eventType : "hit",
    victimId: victim.getId(),
    direction: shotAngleRad,
    impactCoord: victim.getPosition(),
  }

  multiplayerServer.sendHit(hitEvent);
}


function update(timestamp: DOMHighResTimeStamp) {
  if(currentPlayer === null) return;
  if(gameStatus === null) return;

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

  gameStatus.drawPlayersExceptUs(currentPlayer.getId(), gameContext);
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

resizeCanvas();
