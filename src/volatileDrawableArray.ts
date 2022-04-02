import { VolatileDrawable } from './volatileDrawable';

export class VolatileDrawableArray extends Array<VolatileDrawable> {
    public draw(context: CanvasRenderingContext2D):void {
        this.forEach( (item, index) => {
            if(!item.isAlive()) {
                delete this[index];
            }else{
                item.draw(context);
            }
        });
    }
}