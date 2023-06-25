import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-three-fiber';
import { Position } from '../@core/GameObject';
import Graphic from '../@core/Graphic';
import useGameObject from '../@core/useGameObject';
import usePathfinding from '../@core/usePathfinding';
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
    const { transform, nodeRef } = useGameObject();
    const findPath = usePathfinding();
    const [pointerPath, setPointerPath] = useState([]);

    // update on pointer change
    // useEffect(() => {
    //     // if (path.length || !pathVisible) return;
    //     // const nextPath = findPath({
    //     //     from: transform,
    //     //     to: pointer,
    //     // });
    //     // setPointerPath(nextPath);
    // }, [transform, path, pathVisible, pointer, findPath]);

    if (!nodeRef.current) return null;

    // let renderedPath = null;

    // if (pathVisible) {
    //     renderedPath = path.length
    //         ? path.map(({ x, y }, index) => (
    //               // eslint-disable-next-line react/jsx-indent
    //               <group key={`${x}-${y}`} position={[x, y, offsetZ]}>
    //                   <Graphic
    //                       {...spriteData.ui}
    //                       state="dot"
    //                       color="yellow"
    //                       opacity={Math.min(0.75, index / 5)}
    //                       basic
    //                   />
    //               </group>
    //           ))
    //         : pointerPath.map(({ x, y }) => (
    //               // eslint-disable-next-line react/jsx-indent
    //               <group key={`${x}-${y}`} position={[x, y, offsetZ]}>
    //                   <Graphic
    //                       {...spriteData.ui}
    //                       state="solid"
    //                       color="white"
    //                       opacity={0.2}
    //                       basic
    //                   />
    //               </group>
    //           ));
    // }

    // const selectColor = hasTarget ? 'red' : undefined;
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
