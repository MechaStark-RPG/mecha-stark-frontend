import { SpriteProps } from '../@core/Sprite';

export enum MechaState {
    IDLE = 'idle',
    MOVING = 'moving',
    RANGE = 'range',
    MEELE = 'meele',
    DEFENSE = 'defense',
    PERMA_DEF = 'defense1',
}

export type MechaData = {
    attributes: MechaAttributes;
    sprite: SpriteProps;
};

export type MechaAttributes = {
    hp: number;
    hpTotal: number;
    attack: number;
    defense: number;
};

export function calculateDMG(attacker: MechaAttributes, receiver: MechaAttributes) {
    return Math.max(1, attacker.attack - receiver.defense);
}
