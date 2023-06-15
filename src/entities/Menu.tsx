import React, { useEffect, useRef, useState } from 'react';
import GameObject, { GameObjectProps, GameObjectRef } from '../@core/GameObject';
import Sprite, { SpriteRef } from '../@core/Sprite';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import waitForMs from '../@core/utils/waitForMs';
import spriteData from '../spriteData';
import useGameObject from '../@core/useGameObject';

// No se como llamarlo.. representa que algo puede tener Menu

function MenuScript() {
    const { getRef, publish } = useGameObject();
    const [isDisplayed, setIsDisplayed] = useState(false);

    return null;
}

export default function Menu(props: GameObjectProps) {
    return (
        <GameObject {...props}>
            <Sprite {...spriteData.objects} state="workstation-1" />
            <MenuScript />
        </GameObject>
    );
}
