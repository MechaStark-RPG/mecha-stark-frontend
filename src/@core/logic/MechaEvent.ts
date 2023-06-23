import { PubSubEvent } from '../utils/createPubSub';
import { Position } from '../GameObject';

export enum GameEvent {
    MOVE,
    ATTACK,
}

export interface MechaEventData {
    mechaId: string;
}

export interface MechaMovementData {
    mechaId: string;
    position: Position;
}

export type MechaWillMoveEvent = PubSubEvent<'mecha-will-move', MechaEventData>;
export type MechaDidMoveEvent = PubSubEvent<'mecha-did-move', MechaMovementData>;
