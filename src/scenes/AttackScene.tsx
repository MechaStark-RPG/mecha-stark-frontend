import React, { useEffect } from 'react';
import { useFrame } from 'react-three-fiber';
import spriteData from '../spriteData';
import Graphic from '../@core/Graphic';
import GameObject from '../@core/GameObject';
import Sprite from '../@core/Sprite';

const AttackScene = () => {
    useEffect(() => {
        console.log('useEffect() AttackScene');
    }, []);

    useFrame(({ clock }) => {
        const { elapsedTime } = clock;

        // Animation logic that runs on each frame
        // Use elapsedTime to control the progression of the animation based on the elapsed time
        if (elapsedTime > 5) {
            console.log('pasaron 5 segs');
        }
    });

    return (
        <group>
            <GameObject>
                <group position={[1, 1, 0]}>
                    <Graphic {...spriteData.mecha} opacity={1} basic />
                </group>
            </GameObject>
        </group>
    );
};

export default AttackScene;
