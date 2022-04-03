import {Drawable} from './drawable';
import {Vector2} from './vector2';

export class GameMap implements Drawable{

    private static size:number = 90;//in meters
    private static origin:Vector2 = new Vector2(0,0);//in meters
    private static borderSize:number = 0.2;//in meters

    public isPlayerInsideMap(playerCoord: Vector2) {
        const distanceFromOrigin = playerCoord.distance();

        return distanceFromOrigin < GameMap.size/2;
    }

    public draw(context: CanvasRenderingContext2D):void{
	    context.save();

        context.strokeStyle = "white";
        context.beginPath();
	    context.arc(GameMap.origin.x, GameMap.origin.y, GameMap.size/2, 0, 2 * Math.PI, false);
        context.lineWidth = GameMap.borderSize;
        context.stroke();

	    context.restore();
    }
}