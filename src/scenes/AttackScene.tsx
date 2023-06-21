import React, { useEffect, useState, useRef } from 'react';
import { Clock } from 'three';
import { useFrame } from 'react-three-fiber';
import spriteData from '../spriteData';
import Graphic from '../@core/Graphic';
import GameObject from '../@core/GameObject';
import CameraAttackScript from '../components/CameraAttackScript';
import useSceneManager from '../@core/useSceneManager';
import AttackSceneMenu from '../entities/AttackSceneMenu';
import AttackSceneBackground from '../entities/AttackSceneBackground';
import GraphicOriginal from '../@core/GraphicOriginal';

const FLOOR_LEVEL = 1;
const HIT_DISTANCE = 1.5;
const RECEIVER_INITIAL_POSITION = 12;
const ATTACKER_INITIAL_POSITION = -10;

enum MechaState {
    IDLE = 'idle',
    MOVING = 'moving',
    RANGE = 'range',
    MEELE = 'meele',
    DEFENSE = 'defense',
}

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
    const SPRITE_ATTACKER = spriteData.yellow;
    const SPRITE_RECEIVER = spriteData.yellow;

    const [attacker, setAttacker] = useState({
        sprite: SPRITE_ATTACKER,
        position: { x: ATTACKER_INITIAL_POSITION, y: FLOOR_LEVEL },
        state: MechaState.IDLE,
        attributes: {
            hp: attackerStats.hp,
            hpTotal: attackerStats.hpTotal,
            attack: attackerStats.attack,
            defense: attackerStats.defense,
        },
    });

    const [receiver, setReceiver] = useState({
        sprite: SPRITE_RECEIVER,
        position: { x: RECEIVER_INITIAL_POSITION, y: FLOOR_LEVEL },
        state: MechaState.IDLE,
        attributes: {
            hp: receiverStats.hp,
            hpTotal: receiverStats.hpTotal,
            attack: receiverStats.attack,
            defense: receiverStats.defense,
        },
    });

    const initialState = {
        panelPosition: attacker.position,
        attackerStats: attacker.attributes,
        receiverStats: receiver.attributes,
    };

    const [transicionAlpha, setTransitionAlpha] = useState(1);
    const [attackInfoProps, setAttackInfoProps] = useState(initialState);

    const [receiverOnHitPosition, setReceiverOnHitPosition] = useState({ x: 0, y: 0 });
    const [hitClock, setHitClock] = useState(0.0);
    const [hitAnimationCount, setHitAnimationCount] = useState(3);
    const [hitAnimationInProgress, setHitAnimationInProgress] = useState(false);

    const { setScene } = useSceneManager();
    const clockRef = useRef(new Clock());

    useEffect(() => {
        clockRef.current.start();
    }, []);

    useFrame(() => {
        const elapsedTime = clockRef.current.getElapsedTime();
        if (transicionAlpha > 0) {
            setTransitionAlpha(transicionAlpha - 0.03);
        }
        if (elapsedTime > 0.3) {
            if (attacker.position.x < receiver.position.x - HIT_DISTANCE) {
                setAttacker(prevState => ({
                    ...prevState,
                    position: { ...prevState.position, x: prevState.position.x + 0.15 },
                }));

                setAttackInfoProps(prevState => ({
                    ...prevState,
                    panelPosition: attacker.position,
                    hp: { ...prevState.receiverStats, hp: attackerStats.hp },
                }));
            } else {
                // gancho del bicho
                if (hitAnimationCount !== 0 && !hitAnimationInProgress) {
                    setReceiverOnHitPosition(receiver.position);
                    setHitAnimationInProgress(true);
                    setAttacker(prevState => ({
                        ...prevState,
                        state: MechaState.MEELE,
                    }));
                    setReceiver(prevState => ({
                        ...prevState,
                        state: MechaState.DEFENSE,
                    }));

                    setHitClock(elapsedTime);
                }
                // efecto de retroceso
                if (hitAnimationInProgress) {
                    if (hitClock + 0.4 < elapsedTime) {
                        setReceiver(prevState => ({
                            ...prevState,
                            position: {
                                ...prevState.position,
                                x: prevState.position.x + 0.3,
                            },
                        }));
                        if (receiverOnHitPosition.x + 1 > receiver.position.x) {
                            setHitAnimationInProgress(false);
                            hitAnimationCount !== 0
                                ? setHitAnimationCount(hitAnimationCount - 1)
                                : hitAnimationCount;
                            setAttacker(prevState => ({
                                ...prevState,
                                state: MechaState.IDLE,
                            }));
                            setReceiver(prevState => ({
                                ...prevState,
                                state: MechaState.IDLE,
                            }));
                        }
                    }
                }
            }
        }
        if (elapsedTime > 5.3) {
            setTransitionAlpha(transicionAlpha + 0.03);
        }
        if (elapsedTime > 6.3) {
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
                    offset={{
                        x: attacker.position.x - 0.6,
                        y: attacker.position.y - 1.3,
                    }}
                    customScale={{ width: 2.8, height: 1, z: 1 }}
                    opacity={0.3}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{
                        x: receiver.position.x + 0.6,
                        y: receiver.position.y - 1.3,
                    }}
                    customScale={{ width: -2.8, height: 1, z: 1 }}
                    opacity={0.3}
                    basic
                />
            </GameObject>
            <GameObject name="attacker" displayName="Attacker">
                <AttackSceneMenu {...attackInfoProps} />
                <CameraAttackScript attackerPosition={attacker.position} />
                {!hitAnimationInProgress && (
                    <group>
                        <GraphicOriginal
                            {...receiver.sprite}
                            offset={{ x: receiver.position.x, y: receiver.position.y }}
                            customScale={{ width: 3, height: 3, z: 1 }}
                            state={receiver.state}
                            flipX={-1}
                            opacity={1}
                            basic
                        />
                        <Graphic
                            {...attacker.sprite}
                            state={attacker.state}
                            offset={attacker.position}
                            scale={3}
                            opacity={1}
                            basic
                        />
                    </group>
                )}
                {hitAnimationInProgress && (
                    <group>
                        <GraphicOriginal
                            {...receiver.sprite}
                            offset={{ x: receiver.position.x, y: receiver.position.y }}
                            customScale={{ width: 3, height: 3, z: 1 }}
                            flipX={-1}
                            state={receiver.state}
                            opacity={1}
                            basic
                        />
                        <GraphicOriginal
                            {...attacker.sprite}
                            state={attacker.state}
                            offset={attacker.position}
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
                            x: attacker.position.x + 1.2,
                            y: attacker.position.y,
                        }}
                        customScale={{ width: 1.5, height: 1.5, z: 1 }}
                        opacity={0.85}
                        basic
                    />
                )}
            </GameObject>
        </group>
    );
};

export default AttackScene;
