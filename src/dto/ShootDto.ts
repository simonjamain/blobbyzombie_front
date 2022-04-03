import {EventDto} from "./EventDto";
import {Vector2Dto} from "./vector2Dto";

export interface ShootDto extends EventDto {
    origin: Vector2Dto;
    direction: number;
    effectiveRange: number;
}