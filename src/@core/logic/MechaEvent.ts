import { PubSubEvent } from "../utils/createPubSub";
import { Position } from "../GameObject";
import { Action, Mecha } from "./GameState";

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

export interface MechaTryingAttackData {
  mechaAttacker: Mecha;
  position: Position;
}

export interface ProcessMechaAction {
  action: Action;
}

export type MechaWillMoveEvent = PubSubEvent<"mecha-will-move", MechaEventData>;
export type MechaDidMoveEvent = PubSubEvent<"mecha-did-move", MechaMovementData>;
export type MechaWillAttackEvent = PubSubEvent<"mecha-will-attack", MechaEventData>;
export type MechaTryingAttackEvent = PubSubEvent<"mecha-trying-attack", MechaTryingAttackData>;

export type ProcessMechaActionEvent = PubSubEvent<
  "process-mecha-action",
  ProcessMechaAction
>;
