import React, { useEffect, useState, useRef } from 'react';
import { Clock } from 'three';
import { useFrame } from 'react-three-fiber';
import spriteData from '../spriteData';
import Graphic from '../@core/Graphic';
import GameObject from '../@core/GameObject';
import CameraAttackScript from '../components/CameraAttackScript';
import useSceneManager from '../@core/useSceneManager';
import AttackScenePanel from '../entities/AttackScenePanel';
import AttackSceneBackground from '../entities/AttackSceneBackground';
import GraphicOriginal from '../@core/GraphicOriginal';
import { MechaState, MechaData, calculateDMG } from '../entities/MechaData';

const FLOOR_LEVEL = 1;
const HIT_DISTANCE = 1.5;
const RECEIVER_INITIAL_POSITION = 12;
const ATTACKER_INITIAL_POSITION = -10;

const AttackMeeleScene = ({
    attackerStats,
    receiverStats,
}: {
    attackerStats: MechaData;
    receiverStats: MechaData;
}) => {
    const [attacker, setAttacker] = useState({
        sprite: attackerStats.sprite,
        position: { x: ATTACKER_INITIAL_POSITION, y: FLOOR_LEVEL },
        state: MechaState.IDLE,
        attributes: {
            hp: attackerStats.attributes.hp,
            hpTotal: attackerStats.attributes.hpTotal,
            attack: attackerStats.attributes.attack,
            defense: attackerStats.attributes.defense,
        },
    });

    const [receiver, setReceiver] = useState({
        sprite: receiverStats.sprite,
        position: { x: RECEIVER_INITIAL_POSITION, y: FLOOR_LEVEL },
        state: MechaState.IDLE,
        attributes: {
            hp: receiverStats.attributes.hp,
            hpTotal: receiverStats.attributes.hpTotal,
            attack: receiverStats.attributes.attack,
            defense: receiverStats.attributes.defense,
        },
    });

    const totalDamage = calculateDMG(attacker.attributes, receiver.attributes);
    const [attackPanelInfo, setAttackPanelInfo] = useState({
        position: attacker.position,
        attackerStats: attacker,
        receiverStats: receiver,
    });
    const [transicionAlpha, setTransitionAlpha] = useState(1);

    const [activateDust, setActivateDust] = useState(true);

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

                setAttackPanelInfo(prevState => ({
                    ...prevState,
                    position: attacker.position,
                    hp: { ...prevState.receiverStats, hp: attackerStats.attributes.hp },
                }));
            } else {
                if (hitAnimationCount !== 0 && !hitAnimationInProgress) {
                    setReceiverOnHitPosition(receiver.position);
                    setHitAnimationInProgress(true);
                    setAttacker(prevState => ({
                        ...prevState,
                        state: MechaState.MEELE,
                    }));
                    setHitClock(elapsedTime);
                }
                if (hitAnimationInProgress) {
                    setReceiver(prevState => ({
                        ...prevState,
                        state: MechaState.PERMA_DEF,
                    }));
                    if (hitClock + 0.5 < elapsedTime) {
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
        if (hitAnimationCount < 3) {
            if (
                attackPanelInfo.receiverStats.attributes.hp >
                receiver.attributes.hp - totalDamage
            ) {
                setAttackPanelInfo(prevState => ({
                    ...prevState,
                    receiverStats: {
                        ...prevState.receiverStats,
                        attributes: {
                            ...prevState.receiverStats.attributes,
                            hp: attackPanelInfo.receiverStats.attributes.hp - 1,
                        },
                    },
                }));
            }
            setActivateDust(false);
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
            <GameObject
                name="shadows"
                layer="ground"
                displayName="Attack Scene Background"
            >
                <GraphicOriginal
                    {...spriteData.mechaShadow}
                    offset={{
                        x: attacker.position.x - 0.6,
                        y: attacker.position.y - 1.3,
                    }}
                    customScale={{ width: 2.8, height: 1, z: 1 }}
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
                <AttackScenePanel
                    position={attackPanelInfo.position}
                    attackerStats={attackPanelInfo.attackerStats}
                    receiverStats={attackPanelInfo.receiverStats}
                />
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
                        {activateDust && (
                            <GraphicOriginal
                                {...spriteData.dustTrail}
                                offset={{
                                    x: attacker.position.x - 2.4,
                                    y: attacker.position.y - 0.9,
                                }}
                                customScale={{ width: 2, height: 1, z: 10 }}
                                opacity={0.7}
                                flipX={-1}
                                basic
                            />
                        )}
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
                            customScale={{ width: 3, height: 3, z: 1 }}
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
            <GameObject name="explosion" layer="fx" displayName="Explosion Effect">
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

export default AttackMeeleScene;
