import { Position } from '../GameObject';

export type MechaState = {
    id: number;
    idMecha: number;
    position: Position;
    hp: number;
};

export type MechaNFT = {
    id: number;
    hp: number;
    attack: number;
    armor: number;
    mov: number;
    attackShootDistance: number;
    attackMeeleDistance: number;
};

export type Player = {
    id: number;
    address: string;
    username: string;
    nfts: MechaNFT[]; // Only the attributes
};

export type InitState = {
    players: Player[];
    mechas: MechaState[]; // Only the initial states
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
