import React, { useEffect, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import spriteData from '../spriteData';
import Graphic from '../@core/Graphic';
import GameObject from '../@core/GameObject';
import CameraAttackScript from '../components/CameraAttackScript';

const FLOOR_LEVEL = 1;
const ATTACKER_RECEIVER_DISTANCE = 1.5;

const AttackScene = () => {
    const [attackerPosition, setAttackerPosition] = useState({ x: -10, y: FLOOR_LEVEL });
    const [receiverPosition, setReceiverPosition] = useState({ x: 10, y: FLOOR_LEVEL });

    useEffect(() => {
        console.log('useEffect() AttackScene');
    }, []);

    useFrame(({ clock }) => {
        if (attackerPosition.x < receiverPosition.x - ATTACKER_RECEIVER_DISTANCE) {
            setAttackerPosition({ x: attackerPosition.x + 0.1, y: attackerPosition.y });
        }
        const { elapsedTime } = clock;

        // Animation logic that runs on each frame
        // Use elapsedTime to control the progression of the animation based on the elapsed time
        if (elapsedTime > 5) {
            // console.log('pasaron 5 segs');
        }
    });

    return (
        <group>
            <GameObject name="background" displayName="Attack Scene Background">
                <Graphic
                    {...spriteData.attackSceneBackground}
                    offset={{ x: 1, y: 1 }}
                    scale={10}
                    opacity={1}
                    basic
                />
            </GameObject>
            <GameObject name="receiver" displayName="Receiver">
                <Graphic
                    {...spriteData.mechaEnemy}
                    offset={{ x: receiverPosition.x, y: receiverPosition.y }}
                    scale={3}
                    opacity={1}
                    basic
                />
            </GameObject>
            <GameObject name="attacker" displayName="Attacker">
                <CameraAttackScript
                    attackerPosition={{ x: attackerPosition.x, y: attackerPosition.y }}
                />
                <Graphic
                    {...spriteData.mecha}
                    offset={{ x: attackerPosition.x, y: attackerPosition.y }}
                    scale={3}
                    opacity={1}
                    basic
                />
            </GameObject>
        </group>
    );
};

export default AttackScene;
