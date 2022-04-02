import {PlayerDto} from "./playerDto";

export interface StatusDto {
    isGameStarted: boolean,
    playerDict : {string: PlayerDto},
    eventList : []
}