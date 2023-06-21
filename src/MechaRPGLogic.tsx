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
import { Turn, InitState, MechaState, MechaNFT } from './@core/logic/GameState';

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
}

export default function MechaRPGLogic({ initState }: GameLogicProps) {
    const [width, height] = useWindowSize();
    const [turns, setTurns] = useState<Turn[]>([]);
    const [mechas, setMechas] = useState<MechaState[]>();
    const [mechasAttr, setMechaAttr] = useState<MechaNFT[]>();

    useEffect(() => {
        setMechas(initState.mechas);
        const mechaAttrMtx = initState.players.map(player => player.nfts);

        setMechaAttr(
            mechaAttrMtx.reduce(
                (mechasAttr1, mechaAttr2) => mechasAttr1.concat(mechaAttr2),
                []
            )
        );
    }, []);

    return (
        <>
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
        </>
    );
}
