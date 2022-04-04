import {EventDto} from './dto/EventDto';
import {StatusDto} from "./dto/statusDto";
import {Player} from "./player";
import {PlayerDto} from "./dto/playerDto";

export class GameStatus {

    private isGameStarted: boolean;
    private playerList: Player[];
    private playerDict: {string : Player};
    private eventList: any[];

    constructor() {
        this.isGameStarted = false;
        this.playerList = [];
        this.eventList = [];
        this.playerDict = {} as {string : Player};
    }

    public static fromDto = ({isGameStarted, playerList = [], eventList}: StatusDto): GameStatus => {
        let gameStatus = new GameStatus();
        gameStatus.playerDict = {} as {string : Player};
        gameStatus.isGameStarted = isGameStarted;
        gameStatus.playerList = playerList.map((p: PlayerDto) => {
            const player = Player.fromDto(p);
            // @ts-ignore
            gameStatus.playerDict[player.getId()] = player;
            return player;
        });
        gameStatus.eventList = [...eventList];
        return gameStatus;
    }

    // @ts-ignore
    public getPlayerById = (id: string): Player|undefined => this.playerDict[id];

    getPlayerListExceptUs = (currentPlayerId: string) => this.playerList?.filter(p => p.getId() !== currentPlayerId);
    getTankListExceptUs = (currentPlayerId: string) => this.playerList?.filter(p => p.getId() !== currentPlayerId && !p.getIsZombie());

    public drawPlayersExceptUs = (currentPlayerId: string, context: CanvasRenderingContext2D): void => {
        this.getPlayerListExceptUs(currentPlayerId)?.forEach(p => p.draw(context));
    }

    public getIsGameStarted(): boolean {
        return this.isGameStarted;
    }

    public getPlayerList(): Player[] {
        return this.playerList;
    }

    public getEventList(): EventDto[] {
        return this.eventList;
    }

    public getPlayersOrderedByScoreDesc = (): Player[] =>
        this.playerList.sort((p1, p2) => p2.getScore() - p1.getScore());
}
