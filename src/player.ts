import { Vector2 } from './vector2';

export class Player {
    
    private static radius:number = 1;
    private static barrelLength:number = 1.5;
    private static barrelWidth:number = 0.2;
    private static moveSpeed:number = 10;// meters/seconds
    private static turretRotationSpeed:number = 2;// rad/seconds

    constructor(private position: Vector2, private aimingAngleRad: number) {
    }

    public draw(context: CanvasRenderingContext2D):void{
	    context.save();
        // body
	    context.fillStyle = "white";
        context.beginPath();
	    context.arc(this.position.x, this.position.y, Player.radius, 0, 2 * Math.PI, false);
        context.fill();
        // turret
        context.beginPath();
        const barrelEndCoordinate = new Vector2(0, 0);
        barrelEndCoordinate.x = this.position.x + Math.cos(this.aimingAngleRad) * Player.barrelLength
        barrelEndCoordinate.y = this.position.y + Math.sin(this.aimingAngleRad) * Player.barrelLength
        console.log("aimingAngleRad", this.aimingAngleRad)
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(barrelEndCoordinate.x, barrelEndCoordinate.y);
        context.strokeStyle = 'white';
        context.lineWidth = Player.barrelWidth;
        context.stroke();
        context.restore();
    }

    public update(deltaTimeSeconds: number, movement: Vector2, aimRotation: number) {
        const scaledMovement = movement.times(deltaTimeSeconds * Player.moveSpeed);
        this.position = this.position.add(scaledMovement);

        console.log("aimRotation", aimRotation)
        const scaledAimRotation = aimRotation * deltaTimeSeconds * Player.turretRotationSpeed;
        this.aimingAngleRad = (this.aimingAngleRad + scaledAimRotation) % (Math.PI * 2);
    }
}