import { css, Global } from '@emotion/core';
import globalStyles from '../styles/global';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Game from '../@core/Game';
import useWindowSize from '../@core/useWindowSize';
import MechaRPGLogic from './MechaRPGLogic';
import { InitState, Mecha, Player, Turn } from '../@core/logic/GameState';
import { PlayerJoined } from '../@core/Lobby';
import useAuth from '../@core/auth/useAuth';
import useSocket from '../@core/socket/useSocket';

const styles = {
    root: (width: number, height: number) => css`
        display: flex;
        width: ${width - (width % 2)}px;
        height: ${height - (height % 2)}px;
        justify-content: center;
        align-items: center;
    `,
};

export interface GameContainerProps {
    isTurn: boolean;
    playersJoined: PlayerJoined[];
    setTurn: Dispatch<SetStateAction<Turn>>;
    sentTurn: boolean;
}

export default function GameContainer({
    isTurn,
    playersJoined,
    setTurn,
    sentTurn,
}: GameContainerProps) {
    const { username } = useAuth();
    const [width, height] = useWindowSize();
    const { subscribeTo } = useSocket();
    // Turns for all players...
    const [incomingTurn, setIncomingTurn] = useState<Turn>();

    subscribeTo.showTurns((err, iTurn) => {
        console.log('Incoming turn', iTurn);
        setIncomingTurn((iTurn as unknown) as Turn);
    });

    const initState = () => {
        // TODO: Crear los mechas y el init state a partir de los players joined.
        console.log(playersJoined);
        const mecha1: Mecha = ({
            idOwner: 'Santieight',
            id: '87',
            position: { x: 10, y: 6 },
            hp: 200,
            hpTotal: 200,
            attack: 20,
            armor: 5,
            isReady: false,
        } as unknown) as Mecha;

        const mecha2: Mecha = ({
            idOwner: 'Damistone',
            id: '73',
            position: { x: 16, y: 8 },
            hp: 150,
            hpTotal: 150,
            attack: 10,
            armor: 5,
            isReady: false,
        } as unknown) as Mecha;

        const players: Player[] = [
            ({
                id: 1997,
                username: 'Santieight',
            } as unknown) as Player,
            ({
                id: 1995,
                username: 'Damistone',
            } as unknown) as Player,
        ];

        players[0].mechas = [mecha1];
        players[1].mechas = [mecha2];

        const state = ({
            players,
        } as unknown) as InitState;

        return state;
    };

    return (
        <>
            <Global styles={globalStyles} />
            <div css={styles.root(width, height)}>
                <Game cameraZoom={80}>
                    <MechaRPGLogic
                        initState={initState()}
                        isTurn={isTurn}
                        username={username}
                        sentTurn={sentTurn}
                        setTurn={setTurn}
                        incomingTurn={incomingTurn}
                    />
                </Game>
            </div>
        </>
    );
}
