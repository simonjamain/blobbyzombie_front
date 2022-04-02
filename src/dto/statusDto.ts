import {PlayerDto} from "./playerDto";

export interface StatusDto {
    isGameStarted: boolean,
    playerList : PlayerDto[],
    eventList : any[]
}