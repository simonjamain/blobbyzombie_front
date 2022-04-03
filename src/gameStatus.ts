import {StatusDto} from "./dto/statusDto";
import {Player} from "./player";
import {PlayerDto} from "./dto/playerDto";

export class GameStatus {

    private isGameStarted: boolean;
    private playerList: Player[];
    private eventList: any[];

    constructor() {
        this.isGameStarted = false;
        this.playerList = [];
        this.eventList = [];
    }

    public static fromDto = ({isGameStarted, playerList = [], eventList}: StatusDto): GameStatus => {
        let gameStatus = new GameStatus();
        gameStatus.isGameStarted = isGameStarted;
        gameStatus.playerList = playerList.map((p: PlayerDto) => Player.fromDto(p));
        gameStatus.eventList = [...eventList];
        return gameStatus;
    }

    getPlayerListExceptUs = (currentPlayerId: string) => this.playerList?.filter(p => p.getId() !== currentPlayerId);

    drawPlayersExceptUs = (currentPlayerId: string, context: CanvasRenderingContext2D): void => {
        this.getPlayerListExceptUs(currentPlayerId)?.forEach(p => p.draw(context));
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