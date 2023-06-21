import { Position } from '../GameObject';

export type Mecha = {
    idOwner: string;
    position: Position;
    id: number;
    hp: number;
    hpTotal: number;
    attack: number;
    armor: number;
    mov: number;
    attackShootDistance: number;
    attackMeeleDistance: number;
    isReady: boolean;
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
    idPlayer: number;
    actions: Action[];
};

type Action = {
    idMecha: number;
    firstAction: number;
    movement: Position;
    attack: Position;
};
