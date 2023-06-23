import React, { useState } from 'react';
import { GameEvent, MechaEventData } from './MechaEvent';

export interface GameEventContextValue {
    move: (mechaId: string) => void;
    attack: (mechaId: string) => void;
    hasNewEventAvailable: boolean;
    getLastEvent: () => MechaEventData;
}

export const GameEventContext = React.createContext<GameEventContextValue>(null);

export const GameEventProvider = ({ children }) => {
    const [mechaId, setMechaId] = useState<string>(null);
    const [gameEvent, setGameEvent] = useState<GameEvent>(null);
    const [newEventAvailable, setNewEventAvailable] = useState(false);

    const move = mId => {
        setMechaId(mId);
        setGameEvent(GameEvent.MOVE);
        setNewEventAvailable(true);
    };

    const attack = mId => {
        setMechaId(mId);
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
