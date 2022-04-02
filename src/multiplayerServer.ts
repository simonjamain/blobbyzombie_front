import {PlayerDto} from "./dto/playerDto";
import {HitDto} from "./dto/hitDto";
import {ShootDto} from "./dto/ShootDto";
import {PlayerStateDto} from "./dto/playerStateDto";
import {StatusDto} from "./dto/statusDto";
import { io } from "socket.io-client";

export class MultiplayerServer {

    socket;

    constructor(serverUrl: string,
                private whoisCallback: (player: PlayerDto) => void,
                private statusCallback: (status: StatusDto) => void) {
        this.socket = io(serverUrl);
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

    sendShoot(shoot: ShootDto) {
        shoot.eventType = "shoot";
        this.socket.emit('event', shoot)
    }

    sendPosition(playerState: PlayerStateDto) {
        this.socket.emit('playerState', playerState)
    }
}


