import React from 'react';
import Collider, { TriggerEvent } from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import { useSound } from '../@core/Sound';
import Sprite, { SpriteRef } from '../@core/Sprite';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import soundData from '../soundData';
import spriteData from '../spriteData';
import Interactable, { InteractionEvent } from '../@core/Interactable';

function EnableOnTriggerScript() {
    const { getRef } = useGameObject();
    const playSfx = useSound(soundData.eating);

    useGameObjectEvent<InteractionEvent>('interaction', other => {
        console.log('DISPLAYING MENU');
        getRef().transform.setX(other.transform.x + 1);
        getRef().transform.setY(other.transform.y + 1);

        // Dado el ref... creo sus posibles opciones

        playSfx();
    });

    return null;
}

// Deshabilitarlo es matarlo
export default function Menu(props: GameObjectProps) {
    const name = `menu`; // fallback name required for persisted flag
    return (
        <GameObject name={name} persisted {...props}>
            <Sprite {...spriteData.objects} state="pizza" />
            <Interactable />
            <EnableOnTriggerScript />
        </GameObject>
    );
}
