import React, { useEffect, useState } from 'react';
import { Position } from '../@core/GameObject';
import { InteractableRef } from '../@core/Interactable';
import { MoveableRef } from '../@core/Moveable';
import useGameObject from '../@core/useGameObject';
import usePointer from '../@core/usePointer';
import PlayerPathOverlay from './PlayerPathOverlay';
import useGameEvent from '../@core/useGameEvent';
import { ProcessMechaActionEvent } from '../@core/logic/MechaEvent';

function posToString(pos: Position): string {
    return `${pos.x},${pos.y}`;
}

function findPath(from: Position, to: Position): Position[] | null {
    const movements = [
        { dx: 0, dy: 1 }, // Right
        { dx: 0, dy: -1 }, // Left
        { dx: 1, dy: 0 }, // Down
        { dx: -1, dy: 0 }, // Up
    ];

    const queue: Position[] = [from];
    const parents: { [key: string]: Position | null } = { [posToString(from)]: null };

    while (queue.length > 0) {
        const current = queue.shift()!;

        if (current.x === to.x && current.y === to.y) {
            break;
        }

        for (const movement of movements) {
            const neighbor: Position = {
                x: current.x + movement.dx,
                y: current.y + movement.dy,
            };

            const neighborKey = posToString(neighbor);

            // eslint-disable-next-line no-prototype-builtins
            if (!parents.hasOwnProperty(neighborKey)) {
                queue.push(neighbor);
                parents[neighborKey] = current;
            }
        }
    }

    // eslint-disable-next-line no-prototype-builtins
    if (!parents.hasOwnProperty(posToString(to))) {
        // No valid path found
        return null;
    }

    // Reconstruct the path from the initial position to the target position
    const path: Position[] = [];
    let current: Position | null = to;

    while (current) {
        path.unshift(current);
        current = parents[posToString(current)];
    }

    return path;
}

export default function MechaScript() {
    const { name, getComponent, transform } = useGameObject();
    const [path, setPath] = useState<Position[]>([]);
    const [pathOverlayEnabled, setPathOverlayEnabled] = useState(true);

    useGameEvent<ProcessMechaActionEvent>(
        'process-mecha-action',
        processMechaAction => {
            console.log('Quiero procesar el action');
            // If is the action of another mecha, I don't want to process it
            if (processMechaAction.action.idMecha === name) {
                const { action } = processMechaAction;
                if (action.isMovement) {
                    const nextPath = findPath(
                        { x: transform.x, y: transform.y },
                        action.movement
                    );
                    if (path.length > 0) {
                        nextPath.unshift(transform);
                    }
                    setPath(nextPath);
                    setPathOverlayEnabled(true);
                }
            }
        },
        []
    );

    // mouse controls
    const pointer = usePointer();

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
        <PlayerPathOverlay
            path={path}
            pathVisible={pathOverlayEnabled}
            pointer={pointer}
        />
    );
}
