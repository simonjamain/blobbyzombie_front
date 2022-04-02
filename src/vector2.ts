export class Vector2 {
    constructor(public x: number, public y: number) {
    }

    public times(factor :number) {
        const x = this.x * factor;
        const y = this.y * factor;

        return new Vector2(x, y);
    }

    public add(vector :Vector2) {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        
        return new Vector2(x, y);
    }
}