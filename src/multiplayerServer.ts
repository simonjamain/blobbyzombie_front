import {InfestDto} from './dto/infestDto';
import {PlayerDto} from "./dto/playerDto";
import {HitDto} from "./dto/hitDto";
import {ShootDto} from "./dto/ShootDto";
import {PlayerStateDto} from "./dto/playerStateDto";
import {StatusDto} from "./dto/statusDto";

export class MultiplayerServer {
    socket: any;

    constructor(serverUrl: string,
                private whoisCallback: (player: PlayerDto) => void,
                private statusCallback: (status: StatusDto) => void) {
        // @ts-ignore
        this.socket = io(serverUrl, {withCredentials: true});
        this.init();
    }

    init = () => {
        this.socket.on('whois', this.whoisCallback);
        this.socket.on('status', this.statusCallback);
    }

    sendHit(hit: HitDto) {
        hit.eventType = "hit";
        this.socket.emit('event', hit)
    }
    
    sendInfest(infest: InfestDto) {
        infest.eventType = "infest";
        this.socket.emit('event', infest);
    }

    sendShoot(shoot: ShootDto) {
        shoot.eventType = "shoot";
        this.socket.emit('event', shoot)
    }

    sendPosition(playerState: PlayerStateDto) {
        this.socket.emit('playerState', playerState)
    }
}
