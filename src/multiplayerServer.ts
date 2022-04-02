import {PlayerDto} from "./dto/playerDto";
import {HitDto} from "./dto/hitDto";
import {ShootDto} from "./dto/ShootDto";
import {PlayerStateDto} from "./dto/playerStateDto";
import {StatusDto} from "./dto/statusDto";
// @ts-ignore
import io from "socket.io-client";


export class MultiplayerServer {

    socket: any;

    constructor(serverUrl: string,
                private whoisCallback: (player: PlayerDto) => void,
                private statusCallback: (status: StatusDto) => void) {
        // @ts-ignore
        this.socket = io(serverUrl);
        this.init();
    }

    init = () => {
        // @ts-ignore
        this.socket.on('whois', this.whoisCallback);
        // @ts-ignore
        this.socket.on('status', this.statusCallback);
    }

    sendHit(hit: HitDto) {
        hit.eventType = "hit";
        // @ts-ignore
        this.socket.emit('event', hit)
    }

    sendShoot(shoot: ShootDto) {
        shoot.eventType = "shoot";
        // @ts-ignore
        this.socket.emit('event', shoot)
    }

    sendPosition(playerState: PlayerStateDto) {
        // @ts-ignore
        this.socket.emit('playerState', playerState)
    }
}


