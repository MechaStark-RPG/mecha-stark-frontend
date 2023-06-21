import React from 'react';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import Moveable from '../@core/Moveable';
import Sprite from '../@core/Sprite';
import CameraFollowScript from '../components/CameraFollowScript';
import CharacterScript from '../components/CharacterScript';
import MechaScript from '../components/MechaScript';
import spriteData from '../spriteData';

interface MechaProps extends GameObjectProps {
    isTurn: boolean;
}

export default function Mecha({ isTurn, ...props }: MechaProps) {
    return (
        <GameObject name="player" displayName="Player" layer="character" {...props}>
            <Moveable />
            <Interactable />
            <Collider />
            <CharacterScript>
                <Sprite {...spriteData.mechaMap} />
            </CharacterScript>
            {isTurn && <MechaScript />}
        </GameObject>
    );
}
