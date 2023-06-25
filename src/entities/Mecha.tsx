import React from 'react';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import Moveable from '../@core/Moveable';
import Sprite, { SpriteProps } from '../@core/Sprite';
import CharacterScript from '../components/CharacterScript';
import MechaScript from '../components/MechaScript';
import spriteData from '../spriteData';
import MechaScriptFromAction from '../components/MechaScripFromAction';
import { Mecha as MechaType } from '../@core/logic/GameState';

interface MechaProps extends GameObjectProps {
    isTurn: boolean;
    mechaId: string;
    mecha: MechaType;
    spriteMap: SpriteProps;
}

export default function Mecha({ isTurn, mechaId, mecha, spriteMap, ...props }: MechaProps) {
    return (
        <GameObject name={mechaId} displayName="Player" layer="character" {...props}>
            <Moveable />
            <Interactable />
            <Collider />
            <CharacterScript>
                <Sprite {...spriteMap} />
            </CharacterScript>
            {isTurn ? <MechaScript mecha={mecha} /> : <MechaScriptFromAction />}
        </GameObject>
    );
}
