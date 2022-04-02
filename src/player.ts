import { Vector2 } from './vector2';

export class Player {
    
    private static radius:number = 1;

    constructor(private position: Vector2) {
    }

    public draw(context: CanvasRenderingContext2D):void{
	    context.save();
	    context.fillStyle = "white";
        context.beginPath();
	    context.arc(this.position.x, this.position.y, Player.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.restore();
    }

    public update(deltaTimeSeconds: number, movement: Vector2) {
        const scaledMovement = movement.times(deltaTimeSeconds * 10);
        
        this.position = this.position.add(scaledMovement);
    }
}