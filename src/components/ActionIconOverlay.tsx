import React from 'react';
import { createPortal } from 'react-three-fiber';
import { Position } from '../@core/GameObject';
import Graphic from '../@core/Graphic';
import useGameObject from '../@core/useGameObject';
import spriteData from '../spriteData';

export enum ActionType {
    ATTACK = 'attack',
    MOVEMENT = 'movement',
}
interface Props {
    pointer: Position;
    action: ActionType;
}

const offsetZ = 1.5;

export default function ActionIconOverlay({
    pointer,
    action,
}: Props) {
    const { nodeRef } = useGameObject();
    if (!nodeRef.current) return null;

    const spriteIcon = action === ActionType.MOVEMENT ? spriteData.movIcon : spriteData.attackIcon;
    return (
        <>
            {createPortal(
                <>
                    <group position={[pointer.x, pointer.y, offsetZ]}>
                        <Graphic
                            {...spriteIcon}
                            opacity={1}
                            basic
                        />
                    </group>
                </>,
                nodeRef.current.parent
            )}
        </>
    );
}
