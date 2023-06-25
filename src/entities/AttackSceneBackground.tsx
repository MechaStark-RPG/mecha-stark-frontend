import GameObject, { GameObjectProps } from '../@core/GameObject';
import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from 'react-three-fiber';

import spriteData from '../spriteData';
import GraphicOriginal from '../@core/GraphicOriginal';

export default function AttackSceneBackground(props: GameObjectProps) {
    const [skyOffset, setSkyOffset] = useState(0);

    useFrame(() => {
        setSkyOffset(skyOffset + 0.005);
    });

    return (
        <group>
            <GameObject>
                <GraphicOriginal
                    {...spriteData.attackSceneSky}
                    offset={{ x: 3 + skyOffset, y: 6.9 }}
                    customScale={{ width: 100, height: 10, z: 1 }}
                    opacity={1}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.attackSceneGround}
                    offset={{ x: 3, y: 2 }}
                    customScale={{ width: 60, height: 6, z: 10 }}
                    opacity={1}
                    basic
                />
            </GameObject>
        </group>
    );
}
