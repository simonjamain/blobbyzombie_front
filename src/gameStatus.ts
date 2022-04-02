import {StatusDto} from "./dto/statusDto";
import {Player} from "./player";
import {PlayerDto} from "./dto/playerDto";

export class GameStatus {

    private isGameStarted: boolean;
    private playerList: Player[];
    private eventList: any[];

    constructor() {
    }

    public static fromDto = ({isGameStarted, playerList = [], eventList}: StatusDto): GameStatus => {
        let gameStatus = new GameStatus();
        gameStatus.isGameStarted = isGameStarted;
        gameStatus.playerList = playerList.map((p: PlayerDto) => Player.fromDto(p));
        gameStatus.eventList = [...eventList];
        return gameStatus;
    }


    getIsGameStarted(): boolean {
        return this.isGameStarted;
    }

    getPlayerList(): Player[] {
        return this.playerList;
    }

    getEventList(): any[] {
        return this.eventList;
    }
}