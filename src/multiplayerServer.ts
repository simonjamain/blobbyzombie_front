import {PlayerDto} from "./dto/playerDto";
import {HitDto} from "./dto/hitDto";
import {ShootDto} from "./dto/ShootDto";
import {PlayerStateDto} from "./dto/playerStateDto";
import {StatusDto} from "./dto/statusDto";
import {io, Socket} from "socket.io-client";

interface ClientToServerEvents {
    hello: () => void;
}

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (b: string, c: any) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

export class MultiplayerServer {

    socket: Socket<ServerToClientEvents, ClientToServerEvents>;

    constructor(serverUrl: string,
                private whoisCallback: (player: PlayerDto) => void,
                private statusCallback: (status: StatusDto) => void) {
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


