import React, { useEffect, useState, useRef } from 'react';
import { Clock } from 'three';
import { useFrame } from 'react-three-fiber';
import Sprite from '../@core/Sprite';
import spriteData from '../spriteData';
import Graphic from '../@core/Graphic';
import GameObject from '../@core/GameObject';
import CameraAttackScript from '../components/CameraAttackScript';
import useSceneManager from '../@core/useSceneManager';
import AttackSceneMenu from '../entities/AttackSceneMenu';
import GraphicOriginal from '../@core/GraphicOriginal';

const FLOOR_LEVEL = 1;
const ATTACKER_RECEIVER_DISTANCE = 1.5;

const AttackScene = () => {
    const [attackerPosition, setAttackerPosition] = useState({ x: 0, y: FLOOR_LEVEL });
    const [receiverPosition, setReceiverPosition] = useState({ x: 12, y: FLOOR_LEVEL });
    const [transicionAlpha, setTransitionAlpha] = useState(1);

    const [receiverOnHitPosition, setReceiverOnHitPosition] = useState({ x: 0, y: 0 });
    const [hitClock, setHitClock] = useState(0.0);
    const [hitAnimationCount, setHitAnimationCount] = useState(3);
    const [hitAnimationInProgress, setHitAnimationInProgress] = useState(false);
    const [mechaState, setMechaState] = useState('moving');

    const { setScene } = useSceneManager();
    const clockRef = useRef(new Clock());

    useEffect(() => {
        clockRef.current.start();
        setAttackerPosition({ x: 0, y: FLOOR_LEVEL });
        setReceiverPosition({ x: 12, y: FLOOR_LEVEL });
    }, []);

    useFrame(() => {
        const elapsedTime = clockRef.current.getElapsedTime();
        if (transicionAlpha > 0) {
            setTransitionAlpha(transicionAlpha - 0.03);
        }
        if (elapsedTime > 0.2) {
            if (attackerPosition.x < receiverPosition.x - ATTACKER_RECEIVER_DISTANCE) {
                setAttackerPosition({
                    x: attackerPosition.x + 0.15,
                    y: attackerPosition.y,
                });
            } else {
                // gancho del bicho
                if (hitAnimationCount !== 0 && !hitAnimationInProgress) {
                    setReceiverOnHitPosition({ x: receiverPosition.x, y: FLOOR_LEVEL });
                    setHitAnimationInProgress(true);
                    setMechaState('hitMeele');
                    setHitClock(elapsedTime);
                }
                // efecto de retroceso
                if (hitAnimationInProgress) {
                    if (hitClock + 0.4 < elapsedTime) {
                        setReceiverPosition({
                            x: receiverPosition.x + 0.3,
                            y: FLOOR_LEVEL,
                        });
                        if (receiverOnHitPosition.x + 1 > receiverPosition.x) {
                            setHitAnimationInProgress(false);
                            hitAnimationCount !== 0
                                ? setHitAnimationCount(hitAnimationCount - 1)
                                : hitAnimationCount;
                            setMechaState('moving');
                        }
                    }
                }
            }
        }
        if (elapsedTime > 4.3) {
            setTransitionAlpha(transicionAlpha + 0.03);
        }
        if (elapsedTime > 5.3) {
            setScene('office');
        }
    });

    return (
        <group>
            <AttackSceneMenu {...attackerPosition} />
            <GameObject name="background" displayName="Attack Scene Background">
                <Graphic
                    {...spriteData.blackScreen}
                    offset={{ x: -10, y: -10 }}
                    scale={100}
                    opacity={transicionAlpha}
                    basic
                />
            </GameObject>
            <GameObject name="background" displayName="Attack Scene Background">
                <GraphicOriginal
                    {...spriteData.attackSceneBackground}
                    offset={{ x: 8, y: 6 }}
                    customScale={{ width: 33, height: 15, z: 1 }}
                    opacity={1}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.attackSceneBackground}
                    offset={{ x: -25, y: 6 }}
                    customScale={{ width: 33, height: 15, z: 1 }}
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
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{ x: receiverPosition.x + 0.6, y: receiverPosition.y - 1.3 }}
                    customScale={{ width: -2.8, height: 1, z: -10 }}
                    opacity={0.3}
                    basic
                />
            </GameObject>
            <GameObject name="attacker" displayName="Attacker">
                <CameraAttackScript attackerPosition={attackerPosition} />
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{ x: attackerPosition.x - 0.6, y: attackerPosition.y - 1.3 }}
                    customScale={{ width: 2.8, height: 1, z: -10 }}
                    opacity={0.3}
                    basic
                />
                {!hitAnimationInProgress && (
                    <Graphic
                        {...spriteData.mecha}
                        state={mechaState}
                        offset={attackerPosition}
                        scale={3}
                        opacity={1}
                        basic
                    />
                )}
                {hitAnimationInProgress && (
                    <Graphic
                        {...spriteData.mecha}
                        state={mechaState}
                        offset={attackerPosition}
                        scale={3}
                        opacity={1}
                        basic
                    />
                )}
            </GameObject>
        </group>
    );
};

export default AttackScene;
