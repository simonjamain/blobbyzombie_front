import {Vector2} from './vector2';
import {Shot} from './shot';
import {ShootDto} from './dto/ShootDto';
import {InfestDto} from './dto/infestDto';
import {HitDto} from './dto/hitDto';
import {VolatileDrawableArray} from './volatileDrawableArray';
import {Player} from "./player";
import {GameControls} from "./gameControls";
import {PlayerDto} from "./dto/playerDto";
import {StatusDto} from "./dto/statusDto";
import {MultiplayerServer} from "./multiplayerServer";
import {GameStatus} from "./gameStatus";
import {Sound} from './sound';

declare global {
  interface Window { gameCanvas: HTMLCanvasElement; gameContext: CanvasRenderingContext2D;}
}

let url: string;
// url = "https://api.glop.legeay.dev";
url = "http://localhost:3000";

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

const sound = new Sound();
let soundOn = false;
window.addEventListener('keydown', () => { // wait for user interaction
  if (!soundOn) {
    sound.progressTo(0);
    soundOn = true;
  }
})

const onWhoisReceived = (player: PlayerDto) => {
  currentPlayer = Player.fromDto(player);
  currentPlayer.resetUser();
  window.requestAnimationFrame(update);
}

const onStatusReceived = (status: StatusDto) => {
  if(currentPlayer === null) return;

  gameStatus = GameStatus.fromDto(status);

  gameStatus.getEventList().forEach(event => {
    switch(event.eventType) {
      case "shoot" :
        const shootDto = event as ShootDto;

        if(shootDto.playerId !== currentPlayer?.getId()) {
          if(shootDto.playerId !== undefined) {
            const shooter = gameStatus?.getPlayerById(shootDto.playerId);
            if(shooter !== undefined) {
              console.log("received effectiverange", shootDto.effectiveRange);
              const shot = new Shot(Vector2.fromDto(shootDto.origin), shootDto.direction, shooter.getColor(), [], ()=>{}, shootDto.effectiveRange);
              gameObjects.push(shot);
            }
          }
        }
        break;
      case "hit":
        const playersList = gameStatus!.getPlayerList();
        const zombiesCount = playersList.filter(player => player.getIsZombie()).length;
        const progression = zombiesCount / playersList.length;

        if (progression === 1) {
          // END GAME (pas le film)
          sound.gameOver();
        } else {
          sound.hitAndProgressTo(zombiesCount / playersList.length);
        }
        break;
    }
  });
}

const multiplayerServer = new MultiplayerServer(url, onWhoisReceived, onStatusReceived);

function shoot() {
  if(gameStatus === null) return;
  if(currentPlayer === null) return;

  console.log('ammo', currentPlayer.getAmmunitionsLeft());

  if(currentPlayer.getIsZombie() || currentPlayer.getAmmunitionsLeft() <= 0) return;

  const shotFired = currentPlayer.shoot(gameStatus.getPlayerListExceptUs(currentPlayer.getId()), hit);
  gameObjects.push(shotFired);

  const shootEvent:ShootDto = {
    direction : currentPlayer.getAimingAngleRad(),
    eventType : "shoot",
    origin : currentPlayer?.getPosition(),
    playerId : currentPlayer?.getId(),
    effectiveRange: shotFired.getEffectiveRange()
  }
  console.log("emmitted effectiverange", shootEvent.effectiveRange);
  multiplayerServer.sendShoot(shootEvent);
}

function hit(victim:Player, shotAngleRad:number) {
  if(currentPlayer === null) return;

  const hitEvent:HitDto = {
    eventType : "hit",
    victimId: victim.getId(),
    direction: shotAngleRad,
    impactCoord: victim.getPosition(),
  }

  multiplayerServer.sendHit(hitEvent);
}

function infest(infest: InfestDto) {
  multiplayerServer.sendInfest(infest);
}


function update(timestamp: DOMHighResTimeStamp) {

  if (currentPlayer !== null && gameStatus !== null) {
    const deltaTimeSeconds = (timestamp - lastFrameTimestamp) / 1000;

    if(!gameStatus.getIsGameStarted()) {
      currentPlayer.resetUser();
    }

      // UPDATE
    currentPlayer.update(
      deltaTimeSeconds,
      gameControls.getMovementVector(),
      gameControls.getAimRotation(),
      gameStatus.getPlayerById(currentPlayer.getId())?.getIsZombie());

      // DRAW AFTER UPDATE
    const canvasCenter = new Vector2(
      gameCanvas.width / 2,
      gameCanvas.height / 2
    ).dividedBy(scale);

    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameContext.scale(scale, scale);
    const cameraTranslation = currentPlayer.getPosition().minus(canvasCenter);
    gameContext.translate(-cameraTranslation.x, -cameraTranslation.y)

    multiplayerServer.sendPosition({
      position: {
        x: currentPlayer.getPosition().x,
        y: currentPlayer.getPosition().y
      },
      aimingAngleRad: currentPlayer.getAimingAngleRad(),
      ammunitionsLeft: currentPlayer.getAmmunitionsLeft()
    })


    currentPlayer.tryToInfestPlayers(gameStatus.getTankListExceptUs(currentPlayer.getId()), infest);

    gameStatus.drawPlayersExceptUs(currentPlayer.getId(), gameContext);
    currentPlayer.draw(gameContext);

    gameObjects.draw(gameContext);
    gameContext.setTransform(1, 0, 0, 1, 0, 0);
  }

  window.requestAnimationFrame(update);
  lastFrameTimestamp = timestamp;

}

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
        
function resizeCanvas() {
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
}

resizeCanvas();
