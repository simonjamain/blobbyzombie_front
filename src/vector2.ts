import {Vector2Dto} from "./dto/vector2Dto";

export class Vector2 {
    constructor(public x: number, public y: number) {
    }

    public static fromDto(vector2Dto: Vector2Dto) {
        return new Vector2(vector2Dto.x, vector2Dto.y);
    }

    public static fromVector(vector2Dto: Vector2) {
        return new Vector2(vector2Dto.x, vector2Dto.y);
    }

    public times(factor :number) {
        const x = this.x * factor;
        const y = this.y * factor;

        return new Vector2(x, y);
    }

    public distance() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    public dividedBy(divider :number) {
        const x = this.x / divider;
        const y = this.y / divider;

        return new Vector2(x, y);
    }

    public add(vector :Vector2) {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        
        return new Vector2(x, y);
    }

    public minus(vector :Vector2) {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
      
        return new Vector2(x, y);
    }

    public distanceTo(vector :Vector2) {
        const a = (this.x - vector.x)**2;
        const b = (this.y - vector.y)**2;
        return Math.sqrt(a + b);
    }

    public getAngleRad():number {
        return Math.atan2(this.y, this.x);
    }
}