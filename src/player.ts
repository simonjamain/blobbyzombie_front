import { Vector2 } from './vector2';

export class Player {
    
    private static radius:number = 1;
    private static barrelLength:number = 1.5;
    private static barrelWidth:number = 0.2;

    constructor(private position: Vector2, private aimingDirection: Vector2) {
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
        const barrelEndCoordinate = this.position.add(this.aimingDirection.times(Player.barrelLength));
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(barrelEndCoordinate.x, barrelEndCoordinate.y);
        context.strokeStyle = 'white';
        context.lineWidth = Player.barrelWidth;
        context.stroke();
        context.restore();
    }

    public update(deltaTimeSeconds: number, movement: Vector2) {
        const scaledMovement = movement.times(deltaTimeSeconds * 10);
        
        this.position = this.position.add(scaledMovement);
    }
}