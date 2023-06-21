import React, { useEffect, useState, useRef } from 'react';
import { Clock } from 'three';
import { useFrame } from 'react-three-fiber';
import spriteData from '../spriteData';
import Graphic from '../@core/Graphic';
import GameObject from '../@core/GameObject';
import CameraAttackScript from '../components/CameraAttackScript';
import useSceneManager from '../@core/useSceneManager';
import AttackSceneMenu from '../entities/AttackSceneMenu';
import GraphicOriginal from '../@core/GraphicOriginal';
import AttackSceneBackground from '../entities/AttackSceneBackground';

const FLOOR_LEVEL = 1;
const RECEIVER_INITIAL_POSITION = 12;
const ATTACKER_INITIAL_POSITION = -10;

enum MechaState {
    IDLE = 'idle',
    MOVING = 'moving',
    RANGE = 'range',
    MEELE = 'meele',
    DEFENSE = 'defense',
}

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
    const [attackerPosition, setAttackerPosition] = useState(ATTACKER_INITIAL_POSITION);
    const [shotPosition, setShotPosition] = useState(ATTACKER_INITIAL_POSITION);
    const [receiverPosition, setReceiverPosition] = useState(RECEIVER_INITIAL_POSITION);

    const [transicionAlpha, setTransitionAlpha] = useState(1);
    const [attackInfoProps, setAttackInfoProps] = useState(initialState);

    const [hitClock, setHitClock] = useState(0.0);
    const [hitAnimationCount, setHitAnimationCount] = useState(3);
    const [hitAnimationInProgress, setHitAnimationInProgress] = useState(false);
    const [mechaState, setMechaState] = useState(MechaState.IDLE);

    const { setScene } = useSceneManager();
    const clockRef = useRef(new Clock());

    useEffect(() => {
        clockRef.current.start();
        setAttackInfoProps({
            panelPosition: { x: attackerPosition, y: FLOOR_LEVEL, z: 1 },
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
    }, []);

    useFrame(() => {
        const elapsedTime = clockRef.current.getElapsedTime();
        if (transicionAlpha > 0) {
            setTransitionAlpha(transicionAlpha - 0.03);
        }
        if (elapsedTime > 0.5) {
            console.log('animation');
        }
        if (elapsedTime > 4.5) {
            setTransitionAlpha(transicionAlpha + 0.03);
        }
        if (elapsedTime > 5.5) {
            setScene('vixenMap');
        }
    });

    return (
        <group>
            <GameObject name="background" displayName="Attack Scene Background">
                <AttackSceneBackground />
            </GameObject>
            <GameObject name="shadows" displayName="Attack Scene Background">
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{ x: attackerPosition - 0.6, y: attackerPosition - 1.3 }}
                    customScale={{ width: 2.8, height: 1, z: 1 }}
                    opacity={0.3}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{ x: receiverPosition + 0.6, y: receiverPosition - 1.3 }}
                    customScale={{ width: -2.8, height: 1, z: 1 }}
                    opacity={0.3}
                    basic
                />
            </GameObject>
            <GameObject name="attacker" displayName="Attacker">
                <AttackSceneMenu {...attackInfoProps} />
                <CameraAttackScript
                    attackerPosition={{ x: shotPosition, y: FLOOR_LEVEL }}
                />
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
            {/* <GameObject name="explosion" displayName="Explosion Effect">
                {hitAnimationInProgress && (
                    <GraphicOriginal
                        {...spriteData.explotion}
                        offset={{
                            x: attackerPosition + 1.2,
                            y: FLOOR_LEVEL,
                        }}
                        customScale={{ width: 1.3, height: 1.3, z: 10 }}
                        opacity={1}
                        basic
                    />
                )}
            </GameObject> */}
        </group>
    );
};

export default AttackScene;
