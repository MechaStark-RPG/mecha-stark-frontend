import { css, Global } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import AssetLoader from './@core/AssetLoader';
import Game from './@core/Game';
import Scene from './@core/Scene';
import SceneManager from './@core/SceneManager';
import useWindowSize from './@core/useWindowSize';
import OfficeScene from './scenes/OfficeScene';
import OtherScene from './scenes/OtherScene';
import AttackScene from './scenes/AttackScene';
import soundData from './soundData';
import spriteData from './spriteData';
import globalStyles from './styles/global';
import VixenMapScene from './scenes/VixenMap';
import { Turn, InitState, Mecha } from './@core/logic/GameState';
import useSocket from './@core/socket/useSocket';
import useAuth from './@core/auth/useAuth';
import { GameEventProvider } from './@core/logic/GameEvent';

const styles = {
    root: (width: number, height: number) => css`
        display: flex;
        width: ${width - (width % 2)}px;
        height: ${height - (height % 2)}px;
        justify-content: center;
        align-items: center;
    `,
};

const urls = [
    ...Object.values(spriteData).map(data => data.src),
    ...Object.values(soundData).map(data => data.src),
    // flatten
].reduce<string[]>((acc, val) => acc.concat(val), []);

interface GameLogicProps {
    initState: InitState;
    isTurn: boolean;
}

export default function MechaRPGLogic({ initState, isTurn }: GameLogicProps) {
    const { username } = useAuth();
    const { subscribeTo } = useSocket();
    const [width, height] = useWindowSize();
    const [turns, setTurns] = useState<Turn[]>([]);
    // Logica para saber que ocurre con el mecha actualmente
    const [mechas, setMechas] = useState<Mecha[]>();

    useEffect(() => {
        // setMechasState(initState.mechas);
        const mechasFromAllPlayers = initState.players
            .map(player => player.mechas)
            .reduce((m1, m2) => m1.concat(m2), []);
        setMechas(mechasFromAllPlayers);
    }, []);

    useEffect(() => {
        if (mechas !== undefined) {
            const enabledMechas = mechas.map(mecha => {
                if (mecha.idOwner === username) {
                    return { ...mecha, isReady: true };
                }
                return mecha;
            });

            setMechas(enabledMechas);
        }
    }, [isTurn]);

    return (
        <>
            <GameEventProvider>
                <Global styles={globalStyles} />
                <div css={styles.root(width, height)}>
                    <Game cameraZoom={80}>
                        <AssetLoader urls={urls} placeholder="Loading assets ...">
                            <SceneManager defaultScene="vixenMap">
                                <Scene id="attack">
                                    <AttackScene />
                                </Scene>
                                <Scene id="vixenMap">
                                    <VixenMapScene mechas={mechas} />
                                </Scene>
                            </SceneManager>
                        </AssetLoader>
                    </Game>
                </div>
            </GameEventProvider>
        </>
    );
}
