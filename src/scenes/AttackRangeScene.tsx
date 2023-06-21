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
const HIT_DISTANCE = 0.5;
const RECEIVER_INITIAL_POSITION = 12;
const ATTACKER_INITIAL_POSITION = -12;

enum MechaState {
    IDLE = 'idle',
    MOVING = 'moving',
    RANGE = 'range',
    MEELE = 'meele',
    DEFENSE = 'defense',
    PERMA_DEF = 'defense1',
}

const AttackRangeScene = (
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
    const SPRITE_RECEIVER = spriteData.blue;

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

    const [transicionAlpha, setTransitionAlpha] = useState(1);
    const [shotAnimationInProgress, setShotAnimationInProgress] = useState(0);

    const [shotPosition, setShotPosition] = useState({
        x: attacker.position.x + 0.5,
        y: attacker.position.y + 1,
    });
    const [hitClock, setHitClock] = useState(0.0);
    const [shotAnimationCount, setShotAnimationCount] = useState(3);
    const [shotMakeContact, setShotMakeContact] = useState(false);
    const [activateExplotion, setActivateExplotion] = useState(false);

    const initialState = {
        panelPosition: { x: shotPosition.x, y: FLOOR_LEVEL },
        attackerStats: attacker.attributes,
        receiverStats: receiver.attributes,
    };
    const [attackInfoProps, setAttackInfoProps] = useState(initialState);

    const { setScene } = useSceneManager();
    const clockRef = useRef(new Clock());

    useEffect(() => {
        clockRef.current.start();
    }, []);

    useFrame(() => {
        console.log('shotAnimationInProgress', shotAnimationInProgress);
        const elapsedTime = clockRef.current.getElapsedTime();
        if (transicionAlpha > 0) {
            setTransitionAlpha(transicionAlpha - 0.03);
        }
        if (elapsedTime > 1.8 && elapsedTime < 2) {
            setShotAnimationInProgress(1);
        }
        if (elapsedTime > 2) {
            if (shotPosition.x < receiver.position.x - HIT_DISTANCE) {
                setShotPosition({ x: shotPosition.x + 0.3, y: shotPosition.y });
            } else {
                setShotMakeContact(true);
            }

            setAttackInfoProps(prevState => ({
                ...prevState,
                panelPosition: { x: shotPosition.x, y: FLOOR_LEVEL },
                hp: { ...prevState.receiverStats, hp: attackerStats.hp },
            }));

            if (shotAnimationCount === 3) {
                setShotAnimationInProgress(2);
            }
            if (shotAnimationInProgress === 1) {
                if (hitClock + 0.2 < elapsedTime) {
                    shotAnimationCount !== 0
                        ? setShotAnimationCount(shotAnimationCount - 1)
                        : shotAnimationCount;
                }
            }
        }

        if (elapsedTime > 3 && elapsedTime < 4) {
            setReceiver(prevState => ({
                ...prevState,
                state: MechaState.PERMA_DEF,
            }));
            if (shotMakeContact && elapsedTime > 3.3 && elapsedTime < 3.7) {
                setActivateExplotion(true);
                setReceiver(prevState => ({
                    ...prevState,
                    position: {
                        ...prevState.position,
                        x: prevState.position.x + 0.03,
                    },
                }));
            }
        } else {
            setReceiver(prevState => ({
                ...prevState,
                state: MechaState.IDLE,
            }));
            setActivateExplotion(false);
        }
        if (elapsedTime > 5.5) {
            setTransitionAlpha(transicionAlpha + 0.03);
        }
        if (elapsedTime > 6.5) {
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
                {shotAnimationInProgress === 0 && (
                    <group>
                        <CameraAttackScript
                            attackerPosition={{ x: shotPosition.x, y: FLOOR_LEVEL }}
                        />
                        <GraphicOriginal
                            {...attacker.sprite}
                            offset={attacker.position}
                            state="idleWeapon"
                            customScale={{ width: 3, height: 3, z: 1 }}
                            basic
                        />
                    </group>
                )}
                {shotAnimationInProgress === 1 && (
                    <group>
                        <CameraAttackScript
                            attackerPosition={{ x: shotPosition.x, y: FLOOR_LEVEL }}
                        />
                        <GraphicOriginal
                            {...attacker.sprite}
                            offset={attacker.position}
                            state="range"
                            customScale={{ width: 3, height: 3, z: 1 }}
                            basic
                        />
                    </group>
                )}
                {shotAnimationInProgress === 2 && (
                    <group>
                        <CameraAttackScript
                            attackerPosition={{ x: shotPosition.x, y: FLOOR_LEVEL }}
                        />
                        {!shotMakeContact && (
                            <GraphicOriginal
                                {...spriteData.shot}
                                offset={shotPosition}
                                state="ammo"
                                customScale={{ width: 1, height: 0.5, z: 1 }}
                                basic
                            />
                        )}
                        <GraphicOriginal
                            {...attacker.sprite}
                            offset={attacker.position}
                            state="range1"
                            customScale={{ width: 3, height: 3, z: 1 }}
                            basic
                        />
                    </group>
                )}
            </GameObject>
            {activateExplotion && (
                <GameObject>
                    <GraphicOriginal
                        {...spriteData.explotion}
                        offset={shotPosition}
                        customScale={{ width: 1.5, height: 1.5, z: 10 }}
                        opacity={0.85}
                        basic
                    />
                </GameObject>
            )}
            <GameObject name="receiver">
                <GraphicOriginal
                    {...receiver.sprite}
                    offset={{ x: receiver.position.x, y: receiver.position.y }}
                    customScale={{ width: 3, height: 3, z: 1 }}
                    flipX={-1}
                    state={receiver.state}
                    opacity={1}
                    basic
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

export default AttackRangeScene;
