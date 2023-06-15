import React from 'react';
import Collider, { TriggerEvent } from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import { useSound } from '../@core/Sound';
import Sprite from '../@core/Sprite';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import soundData from '../soundData';
import spriteData from '../spriteData';
import { DisplayMenuEvent } from '../@core/MenuTrait';

function EnableOnTriggerScript() {
    const { getRef } = useGameObject();
    const playSfx = useSound(soundData.eating);

    console.log('Script Menu');

    useGameObjectEvent<DisplayMenuEvent>('display-menu', other => {
        console.log('DISPLAYING MENU 1');
        getRef().transform.setX(other.transform.x + 1);
        getRef().setDisabled(false);

        // Dado el ref... creo sus posibles opciones

        playSfx();
    });

    useGameObjectEvent<TriggerEvent>('trigger', other => {
        console.log('DISPLAYING MENU 2');
        getRef().transform.setX(other.transform.x + 1);
        getRef().setDisabled(false);

        // Dado el ref... creo sus posibles opciones

        playSfx();
    });

    return null;
}

// Deshabilitarlo es matarlo
export default function Menu(props: GameObjectProps) {
    const name = `pizza-${props.x}-${props.y}`; // fallback name required for persisted flag
    return (
        <GameObject name={name} persisted {...props}>
            <Sprite {...spriteData.objects} state="pizza" />
            <Collider isTrigger />
            <EnableOnTriggerScript />
        </GameObject>
    );
}
