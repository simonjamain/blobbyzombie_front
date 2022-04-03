import {Drawable} from './drawable';
import {Vector2} from './vector2';

export class GameMap implements Drawable{

    private static size:number = 90;//in meters
    private static origin:Vector2 = new Vector2(0,0);//in meters
    private static borderSize:number = 0.2;//in meters
    public splash:HTMLImageElement;
    public splashReady = false;

    public constructor() {

        this.splash = new Image();
        this.splash.src = "assets/splashTitle.png"; // can also be a remote URL e.g. http://
        this.splash.onload = () => {
            this.splashReady = true;
            console.log(this);
        };
    }

    public isPlayerInsideMap(playerCoord: Vector2) {
        const distanceFromOrigin = playerCoord.distance();

        return distanceFromOrigin < GameMap.size/2;
    }

    public draw(context: CanvasRenderingContext2D):void{
	    context.save();

        if(this.splashReady) {
            context.drawImage(this.splash,-this.splash.width/60,-this.splash.height/60, this.splash.width/30, this.splash.height/30);
        }
        context.strokeStyle = "white";
        context.beginPath();
	    context.arc(GameMap.origin.x, GameMap.origin.y, GameMap.size/2, 0, 2 * Math.PI, false);
        context.lineWidth = GameMap.borderSize;
        context.stroke();

	    context.restore();
    }
}