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
import MechaScriptFromAction from '../components/MechaScripFromAction';

interface MechaProps extends GameObjectProps {
    isTurn: boolean;
    mechaId: string;
}

export default function Mecha({ isTurn, mechaId, ...props }: MechaProps) {
    return (
        <GameObject name={mechaId} displayName="Player" layer="character" {...props}>
            <Moveable />
            <Interactable />
            <Collider />
            <CharacterScript>
                <Sprite {...spriteData.mechaMap} />
            </CharacterScript>
            {isTurn ? <MechaScript /> : <MechaScriptFromAction />}
        </GameObject>
    );
}
