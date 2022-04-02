import {EventDto} from "./EventDto";
import {Vector2Dto} from "./vector2Dto";

export interface HitDto extends EventDto {
    victimId: string;
    direction: Vector2Dto;
    impactCoord: Vector2Dto;
}