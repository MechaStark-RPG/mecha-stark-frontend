import React from 'react';
import { Text } from 'drei';
import GameObject from '../@core/GameObject';
import { useSound } from '../@core/Sound';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import soundData from '../soundData';
import spriteData from '../spriteData';
import Interactable, { InteractionEvent } from '../@core/Interactable';
import GraphicOriginal from '../@core/GraphicOriginal';

function EnableOnTriggerScript() {
    const { getRef } = useGameObject();
    const playSfx = useSound(soundData.eating);

    useGameObjectEvent<InteractionEvent>('interaction', other => {
        getRef().transform.setX(other.transform.x + 1);
        getRef().transform.setY(other.transform.y + 1);

        // Dado el ref... creo sus posibles opciones

        playSfx();
    });

    return null;
}

interface GameObjectProps {
    panelPosition: { x: number; y: number; z: number };
    attackerStats: {
        hp?: number;
        hpTotal?: number;
        attack?: number;
        defense?: number;
    };
    receiverStats: {
        hp?: number;
        hpTotal?: number;
        attack?: number;
        defense?: number;
    };
}

export default function AttackSceneMenu(props: GameObjectProps) {
    return (
        <group>
            <GameObject>
                <GraphicOriginal
                    {...spriteData.menuBackground}
                    offset={{ x: props.panelPosition.x, y: props.panelPosition.y - 4 }}
                    customScale={{ width: 25, height: 4, z: 0 }}
                    opacity={1}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.menuAttack}
                    offset={{ x: props.panelPosition.x, y: props.panelPosition.y - 4 }}
                    customScale={{ width: 24, height: 4, z: 0 }}
                    opacity={1}
                    basic
                />
            </GameObject>
            <GameObject>
                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[
                        props.panelPosition.x - 7.5,
                        props.panelPosition.y - 4,
                        0.1,
                    ]}
                    fontSize={0.5}
                    color="white"
                    applyMatrix4={null}
                >
                    HP: {props.attackerStats.hp} / {props.attackerStats.hpTotal} {'\n\n'}
                    Attack: {props.attackerStats.attack} pts {'\n'}
                    Defense: {props.attackerStats.defense} pts
                </Text>

                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[
                        props.panelPosition.x + 4.5,
                        props.panelPosition.y - 4,
                        0.1,
                    ]}
                    fontSize={0.5}
                    color="white"
                    applyMatrix4={null}
                >
                    HP: {props.receiverStats.hp} / {props.receiverStats.hpTotal} {'\n\n'}
                    Attack: {props.receiverStats.attack} pts {'\n'}
                    Defense: {props.receiverStats.defense} pts
                </Text>
            </GameObject>
        </group>
    );
}
