import { Position } from '../GameObject';

export type Mecha = {
    idOwner: string;
    position: Position;
    id: string;
    hp: number;
    hpTotal: number;
    attack: number;
    armor: number;
    mov: number;
    attackShootDistance: number;
    attackMeeleDistance: number;
    isReady: boolean;
    color: string;
};

export type Player = {
    id: number;
    address: string;
    username: string;
    mechas: Mecha[]; // Only the attributes
};

export type InitState = {
    players: Player[];
};

export type GameState = {
    id: number;
    initState: InitState;
    turns: Action[];
};

export type Turn = {
    id: number;
    idPlayer: string;
    turnNum: number;
    actions: Action[];
};

export type Action = {
    idMecha: string;
    firstAction: number;
    isAttack: boolean;
    isMovement: boolean;
    movement: Position;
    attack: Position;
};
