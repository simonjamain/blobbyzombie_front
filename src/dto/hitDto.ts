import {EventDto} from "./EventDto";
import {Vector2Dto} from "./vector2Dto";

export interface HitDto extends EventDto {
    victimId: string;
    direction: number;
    impactCoord: Vector2Dto;
    newZombie?: boolean;
}