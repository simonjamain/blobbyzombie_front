import { Player } from './player';
import { Volatile } from './volatile';
import { Drawable } from './drawable';
import { Vector2 } from './vector2';
import {Vector3} from "./vector3";
import {lineCircleCollide} from "./collisions";

export class Shot implements Drawable, Volatile{

    private static lifespanMs = 400;
    private static range = 1000;
    private static width = 2;
    private startTimestamp: DOMHighResTimeStamp;
    private endCoords: Vector2;
    private effectiveRange: number;
    private effectiveEndCoords: Vector2;

    constructor(private startCoords: Vector2, private aimingAngle: number, private color: Vector3, potentialPlayerVictims: Array<Player>) {
        this.startTimestamp = performance.now();

        this.endCoords = new Vector2(
            this.startCoords.x + Math.cos(this.aimingAngle) * Shot.range,
            this.startCoords.y + Math.sin(this.aimingAngle) * Shot.range
        );

        let nearestVictim:Player|null = null;
        let nearestVictimDistance:number= Infinity;
        potentialPlayerVictims.forEach((potentialVictim) => {
            if(
                lineCircleCollide(
                    this.startCoords,
                    this.endCoords,
                    potentialVictim.getPosition(),
                    potentialVictim.getRadius()
                )
            ) {
                const distanceToVictim = this.startCoords.distanceTo(potentialVictim.getPosition());
                if(distanceToVictim < nearestVictimDistance) {
                    nearestVictim = potentialVictim;
                    nearestVictimDistance = distanceToVictim;
                }
            }
        });

        // shrink the ray and the range
        if(nearestVictim !== null) {
            this.effectiveRange = nearestVictimDistance;
            this.effectiveEndCoords = new Vector2(
                this.startCoords.x + Math.cos(this.aimingAngle) * this.effectiveRange,
                this.startCoords.y + Math.sin(this.aimingAngle) * this.effectiveRange
            );
        }else{
            this.effectiveRange = Shot.range;
            this.effectiveEndCoords = this.endCoords;
        }
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
        // // console.log("shot aimingAngle", this.aimingAngle)
        context.moveTo(this.startCoords.x, this.startCoords.y);
        context.lineTo(this.effectiveEndCoords.x, this.effectiveEndCoords.y);
        context.strokeStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z},${this.getNormalizedTTL()*this.getNormalizedTTL()})`;
        context.lineWidth = Shot.width * (this.getNormalizedTTL()*this.getNormalizedTTL()*this.getNormalizedTTL());
        context.lineCap = 'round';
        context.stroke();
        context.restore();
    }

    public isAlive(): boolean {
        return this.getNormalizedTTL() > 0 ? true : false;
    }
}