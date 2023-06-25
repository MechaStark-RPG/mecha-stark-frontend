import { css, Global } from '@emotion/core';
import React, { Dispatch, SetStateAction, useState } from 'react';

import globalStyles from '../styles/global';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import MechaRPGLogic from './MechaRPGLogic';
import { InitState, Mecha, Player, Turn } from '../@core/logic/GameState';
import useAuth from '../@core/auth/useAuth';
import useSocket from '../@core/socket/useSocket';
import { PlayerJoined } from '../@core/Lobby';
import useWindowSize from '../@core/useWindowSize';
import Game from '../@core/Game';

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
    const { walletData } = useAuth();
    const [width, height] = useWindowSize();
    const { subscribeTo } = useSocket();
    // Turns for all players...
    const [incomingTurn, setIncomingTurn] = useState<Turn>();

    subscribeTo.showTurns((err, iTurn) => {
        console.log('Incoming turn', iTurn);
        setIncomingTurn(iTurn as unknown as Turn);
    });

    const initState = () => {
        // TODO: Crear los mechas y el init state a partir de los players joined.
        console.log(playersJoined);
        const mecha1: Mecha = {
            idOwner: '0x20e2ff1b50ae6c18b7f2e88423dcd76bceaf83b1aba43b0c3dcdf0ae4ae280a',
            id: '87',
            position: { x: 10, y: 6 },
            hp: 200,
            hpTotal: 200,
            attack: 20,
            armor: 5,
            isReady: false,
            attackMeeleDistance: 2,
        } as unknown as Mecha;

        const mecha2: Mecha = {
            idOwner: 'Damistone',
            id: '73',
            position: { x: 11, y: 6 },
            hp: 150,
            hpTotal: 150,
            attack: 10,
            armor: 5,
            isReady: false,
            attackMeeleDistance: 2,
        } as unknown as Mecha;

        const players: Player[] = [
            {
                id: 1997,
                username: 'Santieight',
            } as unknown as Player,
            {
                id: 1995,
                username: 'Damistone',
            } as unknown as Player,
        ];

        players[0].mechas = [mecha1];
        players[1].mechas = [mecha2];

        const state = {
            players,
        } as unknown as InitState;

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
                        walletData={walletData}
                        sentTurn={sentTurn}
                        setTurn={setTurn}
                        incomingTurn={incomingTurn}
                    />
                </Game>
            </div>
        </>
    );
}
