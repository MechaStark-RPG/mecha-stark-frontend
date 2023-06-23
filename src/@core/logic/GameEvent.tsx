import React, { useState } from 'react';

export enum GameEvent {
    MOVE,
    ATTACK,
}

export interface MechaAction {
    mechaId: string;
    gameEvent: GameEvent;
}

export interface GameEventContextValue {
    move: (mecha_id: string) => void;
    attack: (mecha_id: string) => void;
    hasNewEventAvailable: boolean;
    getLastEvent: () => MechaAction;
}

export const GameEventContext = React.createContext<GameEventContextValue>(null);

export const GameEventProvider = ({ children }) => {
    const [mechaId, setMechaId] = useState<string>(null);
    const [gameEvent, setGameEvent] = useState<GameEvent>(null);
    const [newEventAvailable, setNewEventAvailable] = useState(false);

    const move = mecha_id => {
        setMechaId(mecha_id);
        setGameEvent(GameEvent.MOVE);
        setNewEventAvailable(true);
    };

    const attack = mecha_id => {
        setMechaId(mecha_id);
        setGameEvent(GameEvent.ATTACK);
        setNewEventAvailable(true);
    };

    const hasNewEventAvailable = newEventAvailable === true;

    const getLastEvent = () => {
        setNewEventAvailable(false);
        return { mechaId, gameEvent };
    };

    return (
        <GameEventContext.Provider
            value={{
                move,
                attack,
                hasNewEventAvailable,
                getLastEvent,
            }}
        >
            {children}
        </GameEventContext.Provider>
    );
};
