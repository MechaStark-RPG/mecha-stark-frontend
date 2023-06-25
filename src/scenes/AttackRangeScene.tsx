import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { Clock } from 'three';
import { useFrame } from 'react-three-fiber';
import spriteData from '../spriteData';
import GameObject from '../@core/GameObject';
import CameraAttackScript from '../components/CameraAttackScript';
import useSceneManager from '../@core/useSceneManager';
import AttackScenePanel from '../entities/AttackScenePanel';
import GraphicOriginal from '../@core/GraphicOriginal';
import AttackSceneBackground from '../entities/AttackSceneBackground';
import { MechaState, MechaData, calculateDMG } from '../entities/MechaData';

const FLOOR_LEVEL = 1;
const HIT_DISTANCE = 0.5;
const RECEIVER_INITIAL_POSITION = 12;
const ATTACKER_INITIAL_POSITION = -12;

const AttackRangeScene = ({
    attackerStats,
    receiverStats,
    setRenderAttackScene,
}: {
    attackerStats: MechaData;
    receiverStats: MechaData;
    setRenderAttackScene: Dispatch<SetStateAction<boolean>>;
}) => {
    const [attacker] = useState({
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

    const [attackPanelInfo, setAttackPanelInfo] = useState({
        position: attacker.position,
        attackerStats: attacker,
        receiverStats: receiver,
    });

    const totalDamage = calculateDMG(attacker.attributes, receiver.attributes);

    const [transicionAlpha, setTransitionAlpha] = useState(1);
    const [shotAnimationInProgress, setShotAnimationInProgress] = useState(0);

    const [shotPosition, setShotPosition] = useState({
        x: attacker.position.x + 0.5,
        y: attacker.position.y + 1,
    });
    const [hitClock] = useState(0.0);
    const [shotAnimationCount, setShotAnimationCount] = useState(3);
    const [shotMakeContact, setShotMakeContact] = useState(false);
    const [shotVisible, setShotVisible] = useState(false);
    const [activateExplotion, setActivateExplotion] = useState(false);

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
        if (elapsedTime > 1.3 && elapsedTime < 1.4) {
            setShotAnimationInProgress(1);
        }
        if (elapsedTime > 1.4 && elapsedTime < 2) {
            setShotAnimationInProgress(2);
        }
        if (elapsedTime > 2) {
            if (shotPosition.x < receiver.position.x - HIT_DISTANCE) {
                setShotVisible(true);
                setShotPosition({ x: shotPosition.x + 0.3, y: shotPosition.y });
            } else {
                setShotMakeContact(true);
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
        if (
            shotMakeContact &&
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
        if (elapsedTime > 5.5) {
            setTransitionAlpha(transicionAlpha + 0.03);
        }
        if (elapsedTime > 6.5) {
            setScene('vixenMap');
            setRenderAttackScene(false);
        }
        setAttackPanelInfo(prevState => ({
            ...prevState,
            position: { x: shotPosition.x, y: FLOOR_LEVEL },
        }));
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
                <AttackScenePanel
                    position={attackPanelInfo.position}
                    attackerStats={attackPanelInfo.attackerStats}
                    receiverStats={attackPanelInfo.receiverStats}
                />
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
                        {!shotMakeContact && shotVisible && (
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
        </group>
    );
};

export default AttackRangeScene;
