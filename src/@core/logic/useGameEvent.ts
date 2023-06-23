import { useContext } from 'react';
import { GameEventContext, GameEventContextValue } from './GameEvent';

export default function useGameEvent() {
    return useContext(GameEventContext) as GameEventContextValue;
}
