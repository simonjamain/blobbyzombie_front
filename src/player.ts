import { GameMap } from "./gameMap";
import { InfestDto } from "./dto/infestDto";
import { Shot } from "./shot";
import { Drawable } from "./drawable";
import { Vector2 } from "./vector2";
import { Vector3 } from "./vector3";
import { PlayerDto } from "./dto/playerDto";
import { circleCircleCollide } from "./collisions";
import { accelerate } from "./helpers/scalar";

export class Player implements Drawable {
  private static turretRadius: number = 1;
  private static barrelLength: number = 2.2;
  private static barrelWidth: number = 0.2;
  private static maxMoveSpeed: number = 10; // meters/seconds
  private static turretRotationSpeed: number = 2; // rad/seconds
  private static maxAmmunitions: number = 5;
  private static ammoWidth = 0.16;
  private static hullWidth: number = 2.5;
  private static hullLength: number = 4;
  private static hullDarkening: number = 0.75;
  private static hullRotationSpeed: number = 1; // rad/seconds
  private static acceleration: number = 5; // meters/seconds/seconds
  private ammunitionsLeft: number;

  constructor(
    private id: string,
    private name: string,
    private score: number,
    private isZombie: boolean,
    private position: Vector2,
    private aimingAngleRad: number,
    private color: Vector3,
    private hullAngleRad: number = 0,
    private currentMoveSpeed: number = 0 // meters/seconds
  ) {
    this.ammunitionsLeft = Player.maxAmmunitions;
  }

  public resetUser = () => {
    this.ammunitionsLeft = Player.maxAmmunitions;
  };

  public static fromDto({
    id,
    name,
    color,
    position,
    score,
    isZombie,
    aimingAngleRad,
    ammunitionsLeft,
    hullAngleRad,
  }: PlayerDto) {
    const player = new Player(
      id,
      name,
      score,
      isZombie,
      Vector2.fromDto(position),
      aimingAngleRad,
      Vector3.fromDto(color),
      hullAngleRad
    );
    player.setAmmunitions(ammunitionsLeft);
    return player;
  }

  public getId = () => this.id;
  public getScore = () => this.score;
  public getIsZombie = (): boolean => this.isZombie;
  public getPosition = () => Vector2.fromVector(this.position);
  public getAimingAngleRad = () => this.aimingAngleRad;
  public getAmmunitionsLeft = () => this.ammunitionsLeft;
  public getName = () => this.name;

  public shoot(
    potentialPlayerVictims: Array<Player>,
    hitCallBack: (victim: Player, shotAngleRad: number) => void
  ): Shot {
    this.ammunitionsLeft--;

    return new Shot(
      this.position.add(
        Vector2.fromAngleRad(this.aimingAngleRad, Player.barrelLength)
      ), // shoot in front of the barrel
      this.aimingAngleRad,
      this.getColor(),
      potentialPlayerVictims,
      hitCallBack
    );
  }

  public getColor(): Vector3 {
    return this.color;
  }

  public getRadius(): number {
    return Player.turretRadius;
  }

  public setAmmunitions(munitionNumber: number) {
    this.ammunitionsLeft = munitionNumber;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.save();

    // hull
    context.fillStyle = `rgba(${this.color.x * Player.hullDarkening}, ${
      this.color.y * Player.hullDarkening
    }, ${this.color.z * Player.hullDarkening})`;

    context.translate(this.position.x, this.position.y);
    context.rotate(this.hullAngleRad);
    context.fillRect(
      -Player.hullLength / 2,
      -Player.hullWidth / 2,
      Player.hullLength,
      Player.hullWidth
    );
    context.rotate(-this.hullAngleRad);
    context.translate(-this.position.x, -this.position.y);

    // turret
    context.fillStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z})`;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      Player.turretRadius,
      0,
      2 * Math.PI,
      false
    );
    context.fill();

    // barrel
    if (!this.isZombie) {
      context.beginPath();
      const barrelEndCoordinate = new Vector2(0, 0);
      barrelEndCoordinate.x =
        this.position.x + Math.cos(this.aimingAngleRad) * Player.barrelLength;
      barrelEndCoordinate.y =
        this.position.y + Math.sin(this.aimingAngleRad) * Player.barrelLength;
      context.moveTo(this.position.x, this.position.y);
      context.lineTo(barrelEndCoordinate.x, barrelEndCoordinate.y);
      context.strokeStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z})`;
      context.lineWidth = Player.barrelWidth;
      context.stroke();
    }

    // amunitions
    if (!this.isZombie) {
      for (
        let munitionLeftIndex = 0;
        munitionLeftIndex < this.ammunitionsLeft;
        munitionLeftIndex++
      ) {
        const ammoAngleGap = (Math.PI * 0.85) / Player.maxAmmunitions;

        const ammoAngle =
          this.aimingAngleRad + Math.PI + ammoAngleGap * munitionLeftIndex;

        const startLine = new Vector2(
          this.getPosition().x + Math.cos(ammoAngle) * this.getRadius() * 0.8,
          this.getPosition().y + Math.sin(ammoAngle) * this.getRadius() * 0.8
        );
        const endLine = new Vector2(
          this.getPosition().x + Math.cos(ammoAngle) * this.getRadius() * 0.45,
          this.getPosition().y + Math.sin(ammoAngle) * this.getRadius() * 0.45
        );

        context.strokeStyle = "black";
        context.lineCap = "round";
        context.lineWidth = Player.ammoWidth;
        context.beginPath();
        context.moveTo(startLine.x, startLine.y);
        context.lineTo(endLine.x, endLine.y);
        context.stroke();
      }
    }

    context.restore();
  }

  public update(
    gameMap: GameMap,
    deltaTimeSeconds: number,
    throttle: number,
    hullRotation: number,
    aimRotation: number,
    isZombie?: boolean
  ) {
    this.isZombie = isZombie !== undefined ? isZombie : this.getIsZombie();

    const hullScaledRotation =
      hullRotation * Player.hullRotationSpeed * deltaTimeSeconds;

    this.hullAngleRad =
      (this.hullAngleRad + hullScaledRotation) % (Math.PI * 2);

    // turn turret as well
    this.aimingAngleRad =
      (this.aimingAngleRad + hullScaledRotation) % (Math.PI * 2);

    const targetMoveSpeed = Player.maxMoveSpeed * throttle;
    this.currentMoveSpeed = accelerate(
      this.currentMoveSpeed,
      Math.abs(Player.acceleration),
      deltaTimeSeconds,
      targetMoveSpeed
    );

    const scaledMovement = Vector2.fromAngleRad(
      this.hullAngleRad,
      this.currentMoveSpeed * deltaTimeSeconds
    );

    const newPos = this.position.add(scaledMovement);

    if (gameMap.isPlayerInsideMap(newPos)) {
      this.position = newPos;
    }

    // Turn the turret
    const scaledTurretRotation =
      aimRotation * deltaTimeSeconds * Player.turretRotationSpeed;

    this.aimingAngleRad =
      (this.aimingAngleRad + scaledTurretRotation) % (Math.PI * 2);
  }

  public tryToInfestPlayers(
    potentialPlayerVictims: Array<Player>,
    infestCallBack: (infestDto: InfestDto) => void
  ) {
    if (!this.isZombie) return;

    potentialPlayerVictims.forEach((potentialVictim) => {
      if (
        circleCircleCollide(
          this.getPosition(),
          this.getRadius(),
          potentialVictim.getPosition(),
          potentialVictim.getRadius()
        )
      ) {
        const infest: InfestDto = {
          eventType: "infest",
          victimId: potentialVictim.getId(),
        };
        infestCallBack(infest);
      }
    });
  }
}
