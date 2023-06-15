import React, { useEffect, useState } from 'react';
import { Position } from '../@core/GameObject';
import { InteractableRef } from '../@core/Interactable';
import { MoveableRef } from '../@core/Moveable';
import useGameObject from '../@core/useGameObject';
import usePathfinding from '../@core/usePathfinding';
import usePointer from '../@core/usePointer';
import usePointerClick from '../@core/usePointerClick';
import PlayerPathOverlay from './PlayerPathOverlay';
import { MenuTraitRef } from '../@core/MenuTrait';

export default function PlayerScript() {
    const { getComponent, getRef, transform } = useGameObject();
    const findPath = usePathfinding();
    const [path, setPath] = useState<Position[]>([]);
    const [pathOverlayEnabled, setPathOverlayEnabled] = useState(true);

    // mouse controls
    const pointer = usePointer();

    usePointerClick(async event => {
        //Click derecho
        if (event.button === 0) {
            // Si se cliquea a si mismo
            if (pointer.x === transform.x && pointer.y === transform.y) {
                // Chequear si este async no rompe nada...
                await getComponent<MenuTraitRef>('Menu')?.displayMenu(getRef());
            } else {
                try {
                    const nextPath = findPath({ to: pointer });
                    if (path.length > 0) {
                        nextPath.unshift(transform);
                    }
                    setPath(nextPath);
                    setPathOverlayEnabled(true);
                } catch {
                    // pointer out of bounds
                    setPath([]);
                }
            }
        }
    });

    // walk the path
    useEffect(() => {
        if (!path.length) return;

        const [nextPosition] = path;

        (async () => {
            const anyAction =
                // Si move da 0 es puede ser porque queres moverte a algo que tenes al lado
                (await getComponent<MoveableRef>('Moveable')?.move(nextPosition)) ||
                (path.length === 1 && // Sino me pude mover y  el path es 1 intento interactuar con lo que este al lado
                    (await getComponent<InteractableRef>('Interactable')?.interact(
                        nextPosition
                    )));
            // Voy consumiendo el path recursivamente
            if (anyAction) {
                // proceed with next step in path
                setPath(current => current.slice(1));
            }
        })();
    }, [path, getComponent]);

    return (
        <PlayerPathOverlay
            path={path}
            pathVisible={pathOverlayEnabled}
            pointer={pointer}
        />
    );
}
