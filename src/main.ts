import {GameMap} from './gameMap';
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

const middleMessageContainerEl = document.getElementById('middleScreenMessageContainer') as HTMLDivElement;
const textMessage1 = document.getElementById('textMessage1') as HTMLDivElement;
const textMessage2 = document.getElementById('textMessage2') as HTMLDivElement;
const scoreList = document.getElementById('scoreList') as HTMLUListElement;


let url: string;
url = import.meta.env.VITE_BACKEND_URL;

let currentPlayer: Player|null = null;
let gameStatus: GameStatus|null = null;
let isGameStopped: boolean | null = null;
let currNumberOfPlayer: number = -1;
let lastFrameTimestamp :number = 0;
let gameObjects = new VolatileDrawableArray();
let gameMap = new GameMap();

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
const onInteraction = () => {
  if (!soundOn) {
    updateProgression();
    soundOn = true;
  }
}
window.addEventListener('keydown', onInteraction)
window.addEventListener('click', onInteraction)

const onWhoisReceived = (player: PlayerDto) => {
  currentPlayer = Player.fromDto(player);
  currentPlayer.resetUser();

  window.requestAnimationFrame(update);
}

const onStatusReceived = (status: StatusDto) => {

  if(currentPlayer === null) return;

  gameStatus = GameStatus.fromDto(status);

  const nbPlayer = gameStatus.getPlayerList().length;
  if(currNumberOfPlayer !== nbPlayer) {
    isGameStopped = null;
    currNumberOfPlayer = nbPlayer;
  }

  if(isGameStopped === null) {
    isGameStopped = gameStatus.getIsGameStarted();
  }

  gameStatus.getEventList().forEach(event => {
    switch(event.eventType) {
      case "shoot" :
        const shootDto = event as ShootDto;

        if(shootDto.playerId !== currentPlayer?.getId()) {
          if(shootDto.playerId !== undefined) {
            const shooter = gameStatus?.getPlayerById(shootDto.playerId);
            if(shooter !== undefined) {
              // console.log("received effectiverange", shootDto.effectiveRange);
              const shot = new Shot(Vector2.fromDto(shootDto.origin), shootDto.direction, shooter.getColor(), [], ()=>{}, shootDto.effectiveRange);
              gameObjects.push(shot);
            }
          }
        }

        sound.playEffect('fire');
        break;
      case "hit":
        const hitDto = event as HitDto;

        if (hitDto.newZombie) {
          updateProgression(true);
        } else {
          sound.playEffect('zombie');
        }
        break;
      case "infest":
        updateProgression(true);
        break;
    }
  });
}

const multiplayerServer = new MultiplayerServer(url, onWhoisReceived, onStatusReceived);

function updateProgression(hit?: boolean) {
  if (gameStatus?.getIsGameStarted()) {
    const playersList = gameStatus!.getPlayerList();
    const zombiesCount = playersList.filter(player => player.getIsZombie()).length;
    const progression = zombiesCount / playersList.length;

    if (progression === 1) {
      // END GAME (pas le film)
      sound.gameOver();
    } else {
      if (hit) {
        sound.hitAndProgressTo(zombiesCount / playersList.length);
      } else {
        sound.progressTo(zombiesCount / playersList.length);
      }
    }
  } else {
    sound.progressTo(1);
  }
}

function shoot() {
  if(gameStatus === null) return;
  if(currentPlayer === null) return;

  // console.log('ammo', currentPlayer.getAmmunitionsLeft());

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
  // console.log("emmitted effectiverange", shootEvent.effectiveRange);
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
      if(!isGameStopped) {
        isGameStopped = true;
        activeMiddleScreenMessage("Une nouvelle partie commence bientôt !", "Scores");
      }
      currentPlayer.resetUser();

    } else if(gameStatus.getIsGameStarted()) {
        isGameStopped = false;
        disableMiddleScreenMessage();

      if (!sound.isPlaying()) {
        sound.progressTo(0);
      }
    }

      // UPDATE
    currentPlayer.update(
      gameMap,
      deltaTimeSeconds,
      gameControls.getThrottle(),
      gameControls.getHullRotation(),
      gameControls.getAimRotation(),
      gameStatus.getPlayerById(currentPlayer.getId())?.getIsZombie());

    // DRAW AFTER UPDATE
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameContext.scale(scale, scale);

    const canvasCenter = new Vector2(
      gameCanvas.width / 2,
      gameCanvas.height / 2
    ).dividedBy(scale);

    const cameraTranslation = currentPlayer.getPosition().minus(canvasCenter);
    gameContext.translate(-cameraTranslation.x, -cameraTranslation.y)

    // DRAW here after translation
    gameMap.draw(gameContext);

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

const activeMiddleScreenMessage = (msg1: string = "", msg2: string = ""): void => {
  middleMessageContainerEl.style.display = "block";
  textMessage1.textContent = msg1;
  textMessage2.textContent = msg2;
  insertScoreList(scoreList);
}
const disableMiddleScreenMessage = (): void => {
  middleMessageContainerEl.style.display = "none";
  scoreList.textContent = "";
}

const insertScoreList = (containerEl: HTMLUListElement) => {
  if(gameStatus === null) return;
  containerEl.textContent = "";

  const playerListOrdered = gameStatus.getPlayersOrderedByScoreDesc();
  let listSize = playerListOrdered?.length ?? 0;
  listSize = listSize > 5 ? 5 : listSize;

  for (let i = 0; i < listSize; i++) {
    const currPlay: Player = playerListOrdered[i];
    const liEl = document.createElement("li") as HTMLElement;
    liEl.textContent = `${currPlay.getName()} : ${currPlay.getScore()}`;
    if(currPlay.getId() === currentPlayer?.getId()) {
      liEl.style.backgroundColor = `rgb(${currentPlayer.getColor().x},${currentPlayer.getColor().y},${currentPlayer.getColor().z})`;
      liEl.style.color = "#000";
    }
    containerEl.appendChild(liEl);
  }
}
