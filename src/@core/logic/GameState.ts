import { Position } from '../GameObject';

type Mecha = {
    position: Position;
    life: number;
    attackPower: number;
    deffensePower: number;
};

type Player = {
    address: string;
    username: string;
    mechas: Mecha[];
};

type InitState = {
    players: Player[];
};

type GameState = {
    initState: InitState;
};

type Action = {};
