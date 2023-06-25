import React, { useState } from 'react';
import { Position } from '../@core/GameObject';
import Graphic from '../@core/Graphic';
import useGameObject from '../@core/useGameObject';
import spriteData from '../spriteData';

interface Props {
    movements: Position[];
}

export default function MovementGlow({
    movements,
}: Props) {
    const [movementTile, setMovementTile] = useState([]);

    let renderedMovements = null;

    renderedMovements = movements.length
        ? movements.map(({ x, y }) => (
                // eslint-disable-next-line react/jsx-indent
                <group key={`${x}-${y}`} position={[x, y, 0]}>
                    <Graphic
                        {...spriteData.ui}
                        state="solid"
                        color="white"
                        opacity={0.2}
                        basic
                    />
                </group>
            ))
        : movementTile.map(({ x, y }) => (<></>));

    return (
        <>
            {renderedMovements}
        </>
    );
}
