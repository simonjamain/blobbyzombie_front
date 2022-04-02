import {Shot} from './shot';
import {Drawable} from './drawable';
import {Vector2} from './vector2';
import {Vector3} from "./vector3";
import {PlayerDto} from "./dto/playerDto";

export class Player implements Drawable{

    private static radius:number = 1;
    private static barrelLength:number = 1.5;
    private static barrelWidth:number = 0.2;
    private static moveSpeed:number = 10;// meters/seconds
    private static turretRotationSpeed:number = 2;// rad/seconds

    constructor(private id: String,
                // private name: string,
                // private score: number,
                // private isZombie: boolean,
                private position: Vector2,
                private aimingAngleRad: number,
                private color: Vector3) {

    }

    public static fromDto({id, /*name,*/ color, position,/* score, isZombie,*/ aimingAngleRad}: PlayerDto) {
        return new Player(id, /*name, score, isZombie, */Vector2.fromDto(position), aimingAngleRad, Vector3.fromDto(color));
    }

    public getId = () => this.id;
    public getPosition = () => Vector2.fromVector(this.position);
    public getAimingAngleRad= () => this.aimingAngleRad;

    public shoot(potentialPlayerVictims: Array<Player>):Shot {
        return new Shot(this.position, this.aimingAngleRad, this.getColor(), potentialPlayerVictims);
    }

    public getColor():Vector3 {
        return this.color;
    }

    public getRadius():number {
        return Player.radius;
    }

    public draw(context: CanvasRenderingContext2D):void{
	    context.save();
        // body
	    context.fillStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z})`;
        context.beginPath();
	    context.arc(this.position.x, this.position.y, Player.radius, 0, 2 * Math.PI, false);
        context.fill();
        // turret
        context.beginPath();
        const barrelEndCoordinate = new Vector2(0, 0);
        barrelEndCoordinate.x = this.position.x + Math.cos(this.aimingAngleRad) * Player.barrelLength
        barrelEndCoordinate.y = this.position.y + Math.sin(this.aimingAngleRad) * Player.barrelLength
        // console.log("aimingAngleRad", this.aimingAngleRad)
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(barrelEndCoordinate.x, barrelEndCoordinate.y);
        context.strokeStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z})`;
        context.lineWidth = Player.barrelWidth;
        context.stroke();
        context.restore();
    }

    public update(deltaTimeSeconds: number, movement: Vector2, aimRotation: number) {
        const scaledMovement = movement.times(deltaTimeSeconds * Player.moveSpeed);
        this.position = this.position.add(scaledMovement);

        // console.log("aimRotation", aimRotation)
        const scaledAimRotation = aimRotation * deltaTimeSeconds * Player.turretRotationSpeed;
        this.aimingAngleRad = (this.aimingAngleRad + scaledAimRotation) % (Math.PI * 2);
    }
}