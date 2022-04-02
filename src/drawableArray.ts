import { Drawable } from './drawable';

export class DrawableArray extends Array<Drawable> {
    public draw(context: CanvasRenderingContext2D):void {
        this.forEach(drawable => {
            drawable.draw(context);
        });
    }
}