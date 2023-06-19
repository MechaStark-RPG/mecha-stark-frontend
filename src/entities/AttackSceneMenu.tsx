import React from 'react';
import GameObject, { GameObjectProps, Position } from '../@core/GameObject';
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

export default function AttackSceneMenu(props: GameObjectProps) {
    return (
        <group>
            <GameObject>
                <GraphicOriginal
                    {...spriteData.menuBackground}
                    offset={{ x: props.x, y: props.y - 4 }}
                    customScale={{ width: 25, height: 4, z: 1 }}
                    opacity={1}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.menuAttack}
                    offset={{ x: props.x, y: props.y - 4 }}
                    customScale={{ width: 24, height: 4, z: 1 }}
                    opacity={1}
                    basic
                />
            </GameObject>
        </group>
    );
}
