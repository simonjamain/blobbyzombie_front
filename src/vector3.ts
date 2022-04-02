import {Vector3Dto} from "./dto/vector3Dto";

export class Vector3 {
    constructor(public x: number, public y: number, public z: number) {
    }

    public static fromDto(vector3Dto: Vector3Dto) {
        return new Vector3(vector3Dto.x, vector3Dto.y, vector3Dto.z);
    }
}