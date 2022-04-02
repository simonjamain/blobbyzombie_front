import {Vector3Dto} from "./vector3Dto";
import {Vector2Dto} from "./vector2Dto";

export interface PlayerDto {
    id: string;
    name: string;
    color: Vector3Dto;
    position: Vector2Dto;
    score: number;
    isZombie: boolean;
    aimingAngleRad: number;
}




