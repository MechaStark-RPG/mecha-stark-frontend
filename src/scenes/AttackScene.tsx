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
const FLOOR_LEVEL1 = 2;
const ATTACKER_RECEIVER_DISTANCE = 1.5;

const initialState = {
    panelPosition: {
        x: 0,
        y: 0,
        z: 0,
    },
    attackerStats: {
        hp: 0,
        hpTotal: 0,
        attack: 0,
        defense: 0,
    },
    receiverStats: {
        hp: 0,
        hpTotal: 0,
        attack: 0,
        defense: 0,
    },
};

const AttackScene = (
    attackerStats: {
        hp?: number;
        hpTotal?: number;
        attack?: number;
        defense?: number;
    } = {},
    receiverStats: {
        hp?: number;
        hpTotal?: number;
        attack?: number;
        defense?: number;
    } = {}
) => {
    const [attackerPosition, setAttackerPosition] = useState({ x: 0, y: FLOOR_LEVEL });
    const [receiverPosition, setReceiverPosition] = useState({ x: 12, y: FLOOR_LEVEL });
    const [transicionAlpha, setTransitionAlpha] = useState(1);
    const [attackInfoProps, setAttackInfoProps] = useState(initialState);

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
        setAttackInfoProps({
            panelPosition: { x: 0, y: FLOOR_LEVEL, z: 1 },
            attackerStats: {
                hp: attackerStats.hp,
                hpTotal: attackerStats.hpTotal,
                attack: attackerStats.attack,
                defense: attackerStats.defense,
            },
            receiverStats: {
                hp: receiverStats.hp,
                hpTotal: receiverStats.hpTotal,
                attack: receiverStats.attack,
                defense: receiverStats.defense,
            },
        });
    }, [
        attackerStats.attack,
        attackerStats.defense,
        attackerStats.hp,
        attackerStats.hpTotal,
        receiverStats.attack,
        receiverStats.defense,
        receiverStats.hp,
        receiverStats.hpTotal,
    ]);

    useFrame(() => {
        const elapsedTime = clockRef.current.getElapsedTime();
        if (transicionAlpha > 0) {
            setTransitionAlpha(transicionAlpha - 0.03);
        }
        if (elapsedTime > 0.3) {
            if (attackerPosition.x < receiverPosition.x - ATTACKER_RECEIVER_DISTANCE) {
                setAttackerPosition({
                    x: attackerPosition.x + 0.15,
                    y: attackerPosition.y,
                });
                setAttackInfoProps({
                    panelPosition: { x: attackerPosition.x, y: attackerPosition.y, z: 1 },
                    attackerStats: {
                        hp: attackerStats.hp,
                        hpTotal: attackerStats.hpTotal,
                        attack: attackerStats.attack,
                        defense: attackerStats.defense,
                    },
                    receiverStats: {
                        hp: receiverStats.hp,
                        hpTotal: receiverStats.hpTotal,
                        attack: receiverStats.attack,
                        defense: receiverStats.defense,
                    },
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
            <GameObject name="shadows" displayName="Attack Scene Background">
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{ x: attackerPosition.x - 0.6, y: attackerPosition.y - 1.3 }}
                    customScale={{ width: 2.8, height: 1, z: 1 }}
                    opacity={0.3}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{ x: receiverPosition.x + 0.6, y: receiverPosition.y - 1.3 }}
                    customScale={{ width: -2.8, height: 1, z: 1 }}
                    opacity={0.3}
                    basic
                />
            </GameObject>
            <GameObject name="attacker" displayName="Attacker">
                <AttackSceneMenu {...attackInfoProps} />
                <CameraAttackScript attackerPosition={attackerPosition} />
                {!hitAnimationInProgress && (
                    <group>
                        <GraphicOriginal
                            {...spriteData.mechaEnemy}
                            offset={{ x: receiverPosition.x, y: receiverPosition.y }}
                            customScale={{ width: 3, height: 3, z: 0 }}
                            opacity={1}
                            basic
                        />
                        <Graphic
                            {...spriteData.mecha}
                            state={mechaState}
                            offset={attackerPosition}
                            scale={3}
                            opacity={1}
                            basic
                        />
                    </group>
                )}
                {hitAnimationInProgress && (
                    <group>
                        <GraphicOriginal
                            {...spriteData.mechaEnemy}
                            offset={{ x: receiverPosition.x, y: receiverPosition.y }}
                            customScale={{ width: 3, height: 3, z: 0 }}
                            opacity={1}
                            basic
                        />
                        <GraphicOriginal
                            {...spriteData.mecha}
                            state={mechaState}
                            offset={attackerPosition}
                            customScale={{ width: 3, height: 3, z: 0 }}
                            opacity={1}
                            basic
                        />
                    </group>
                )}
            </GameObject>
            <GameObject name="blackScreen" displayName="Black Screen">
                <GraphicOriginal
                    {...spriteData.blackScreen}
                    offset={{ x: -10, y: -10 }}
                    customScale={{ width: 100, height: 100, z: 10 }}
                    opacity={transicionAlpha}
                    basic
                />
            </GameObject>
            <GameObject name="explosion" displayName="Explosion Effect">
                {hitAnimationInProgress && (
                    <GraphicOriginal
                        {...spriteData.explotion}
                        offset={{
                            x: attackerPosition.x + 1.2,
                            y: attackerPosition.y,
                        }}
                        customScale={{ width: 1.3, height: 1.3, z: 10 }}
                        opacity={1}
                        basic
                    />
                )}
            </GameObject>
        </group>
    );
};

export default AttackScene;
