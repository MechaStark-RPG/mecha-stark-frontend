import { css, Global } from '@emotion/core';
import React from 'react';
import AssetLoader from './@core/AssetLoader';
import Game from './@core/Game';
import Scene from './@core/Scene';
import SceneManager from './@core/SceneManager';
import useWindowSize from './@core/useWindowSize';
import OfficeScene from './scenes/OfficeScene';
import OtherScene from './scenes/OtherScene';
import AttackMeeleScene from './scenes/AttackMeeleScene';
import AttackRangeScene from './scenes/AttackRangeScene';
import soundData from './soundData';
import spriteData from './spriteData';
import globalStyles from './styles/global';
import VixenMapScene from './scenes/VixenMap';

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
                        <SceneManager defaultScene="range">
                            <Scene id="office">
                                <OfficeScene />
                            </Scene>
                            <Scene id="other">
                                <OtherScene />
                            </Scene>
                            <Scene id="meele">
                                <AttackMeeleScene />
                            </Scene>
                            <Scene id="range">
                                <AttackRangeScene />
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
