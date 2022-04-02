import { Volatile } from './volatile';
import { Drawable } from './drawable';
import { Vector2 } from './vector2';
import {Vector3} from "./vector3";

export class Shot implements Drawable, Volatile{

    private static lifespanMs = 400;
    private static range = 1000;
    private static width = 2;
    private startTimestamp: DOMHighResTimeStamp;

    constructor(private startPosition: Vector2, private aimingAngle: number, private color: Vector3) {
        this.startTimestamp = performance.now();
    }

    private getElapsedTime():number {
        return performance.now() - this.startTimestamp;
    }

    /**
     * 
     * @returns 1 = you are born, 0 = you are dead
     */
    private getNormalizedTTL():number {
        return Math.max(0, (Shot.lifespanMs - this.getElapsedTime()) / Shot.lifespanMs  );
    }

    public draw(context: CanvasRenderingContext2D): void {


        context.save();
        context.beginPath();
        const shotEndCoordinate = new Vector2(0, 0);
        shotEndCoordinate.x = this.startPosition.x + Math.cos(this.aimingAngle) * Shot.range
        shotEndCoordinate.y = this.startPosition.y + Math.sin(this.aimingAngle) * Shot.range
        // // console.log("shot aimingAngle", this.aimingAngle)
        context.moveTo(this.startPosition.x, this.startPosition.y);
        context.lineTo(shotEndCoordinate.x, shotEndCoordinate.y);
        context.strokeStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z},${this.getNormalizedTTL()*this.getNormalizedTTL()})`;
        context.lineWidth = Shot.width * (this.getNormalizedTTL()*this.getNormalizedTTL()*this.getNormalizedTTL());
        context.stroke();
        context.restore();
    }

    public isAlive(): boolean {
        return this.getNormalizedTTL() > 0 ? true : false;
    }
}