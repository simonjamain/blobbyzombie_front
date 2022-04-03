import { Vector2 } from "./vector2";

export function pointCircleCollide(pointCoords: Vector2, circleCoords: Vector2, radius: number) {
    if (radius===0) return false;
    var dx = circleCoords.x - pointCoords.x;
    var dy = circleCoords.y - pointCoords.y;
    return dx**2 + dy**2 <= radius**2;
}

export function lineCircleCollide(lineStartCoords: Vector2, lineEndCoords: Vector2, circleCoords: Vector2, radius: number, nearest?: Vector2) {
    //check to see if start or end points lie within circle 
    if (pointCircleCollide(lineStartCoords, circleCoords, radius)) {
        if (nearest) {
            nearest.x = lineStartCoords.x;
            nearest.y = lineStartCoords.y;
        }
        return true;
    } if (pointCircleCollide(lineEndCoords, circleCoords, radius)) {
        if (nearest) {
            nearest.x = lineEndCoords.x;
            nearest.y = lineEndCoords.y;
        }
        return true;
    }
    
    var x1 = lineStartCoords.x,
        y1 = lineStartCoords.y,
        x2 = lineEndCoords.x,
        y2 = lineEndCoords.y,
        cx = circleCoords.x,
        cy = circleCoords.y;

    //vector d
    var dx = x2 - x1;
    var dy = y2 - y1;
    
    //vector lc
    var lcx = cx - x1;
    var lcy = cy - y1;
    
    //project lc onto d, resulting in vector p
    var dLen2 = dx * dx + dy * dy; //len2 of d
    var px = dx;
    var py = dy;
    if (dLen2 > 0) {
        var dp = (lcx * dx + lcy * dy) / dLen2;
        px *= dp;
        py *= dp;
    }
    
    if (!nearest) nearest = new Vector2(0,0);
    nearest.x = x1 + px;
    nearest.y = y1 + py;
    
    //len2 of p
    var pLen2 = px * px + py * py;

    //check collision
    return pointCircleCollide(nearest, circleCoords, radius) && pLen2 <= dLen2 && (px * dx + py * dy) >= 0;
}

export function circleCircleCollide(circle1Coords: Vector2, circle1Radius: number, circle2Coords: Vector2, circle2Radius: number) {
    if (circle2Radius===0) return false;

    var dx = circle2Coords.x - circle1Coords.x;
    var dy = circle2Coords.y - circle1Coords.y;
    return dx**2 + dy**2 <= (circle1Radius + circle2Radius)**2;
}