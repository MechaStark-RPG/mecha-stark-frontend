import { css, Global } from '@emotion/core';
import React from 'react';
import AssetLoader from './@core/AssetLoader';
import Game from './@core/Game';
import Scene from './@core/Scene';
import SceneManager from './@core/SceneManager';
import useWindowSize from './@core/useWindowSize';
import OfficeScene from './scenes/OfficeScene';
import OtherScene from './scenes/OtherScene';
import AttackScene, { AttackSceneType } from './scenes/AttackScene';
import soundData from './soundData';
import spriteData from './spriteData';
import globalStyles from './styles/global';
import VixenMapScene from './scenes/VixenMap';
/** @jsx jsx */
import { jsx } from '@emotion/core';

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

export default function GameApp() {
    const [width, height] = useWindowSize();

    return (
        <>
            <Global styles={globalStyles} />
            <div css={styles.root(width, height)}>
                <Game cameraZoom={80}>
                    <AssetLoader urls={urls} placeholder="Loading assets ...">
                        <SceneManager defaultScene="attackScene">
                            <Scene id="attackScene">
                                <AttackScene
                                    attackerStats={{
                                        attributes: {
                                            hp: 100,
                                            hpTotal: 100,
                                            attack: 80,
                                            defense: 20,
                                        },
                                        sprite: spriteData.yellow,
                                    }}
                                    receiverStats={{
                                        attributes: {
                                            hp: 200,
                                            hpTotal: 200,
                                            attack: 24,
                                            defense: 35,
                                        },
                                        sprite: spriteData.blue,
                                    }}
                                    type={AttackSceneType.RANGE}
                                />
                            </Scene>
                            <Scene id="vixenMap">
                                <VixenMapScene />
                            </Scene>
                        </SceneManager>
                    </AssetLoader>
                </Game>
            </div>
        </>
    );
}
