import React, { useEffect, useState } from 'react';
import { Position } from '../@core/GameObject';
import { InteractableRef } from '../@core/Interactable';
import { MoveableRef } from '../@core/Moveable';
import useGameObject from '../@core/useGameObject';
import usePathfinding from '../@core/usePathfinding';

import PlayerPathOverlay from './PlayerPathOverlay';
import useGameEvent from '../@core/useGameEvent';
import { ProcessMechaActionEvent } from '../@core/logic/MechaEvent';

export default function MechaScriptFromAction() {
    const { name, getComponent } = useGameObject();
    const findPath = usePathfinding();
    const [path, setPath] = useState<Position[]>([]);
    const [pathOverlayEnabled, setPathOverlayEnabled] = useState(true);
    const [pointer, setPointer] = useState<Position>();

    useGameEvent<ProcessMechaActionEvent>(
        'process-mecha-action',
        processMechaAction => {
            console.log('Quiero procesar el action');
            // If is the action of another mecha, I don't want to process it
            if (processMechaAction.action.idMecha === name) {
                const { action } = processMechaAction;
                if (action.isMovement) {
                    const nextPath = findPath({ to: action.movement });
                    setPath(nextPath);
                    setPointer(action.movement);
                    setPathOverlayEnabled(true);
                }
            }
        },
        []
    );

    // walk the path
    useEffect(() => {
        if (!path.length) {
            return;
        }
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
        <>
            {pointer && (
                <PlayerPathOverlay
                    path={path}
                    pathVisible={pathOverlayEnabled}
                    pointer={pointer}
                />
            )}
        </>
    );
}
