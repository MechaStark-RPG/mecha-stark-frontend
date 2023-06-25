import React, { useEffect, useState } from "react";
import { Position } from "../@core/GameObject";
import { InteractableRef } from "../@core/Interactable";
import { MoveableRef } from "../@core/Moveable";
import useGameObject from "../@core/useGameObject";
import usePathfinding from "../@core/usePathfinding";
import usePointer from "../@core/usePointer";
import usePointerClick from "../@core/usePointerClick";
import PlayerPathOverlay from "./PlayerPathOverlay";
import useGameEvent from "../@core/useGameEvent";
import useGame from "../@core/useGame";
import {
  MechaDidMoveEvent, MechaTryingAttackData,
  MechaTryingAttackEvent,
  MechaWillAttackEvent,
  MechaWillMoveEvent
} from "../@core/logic/MechaEvent";
import MovementGlow from "./MovementGlow";
import { Mecha as MechaType } from "../@core/logic/GameState";


interface MechaScriptProps {
  mecha: MechaType;
}

export default function MechaScript({ mecha }: MechaScriptProps) {
  const { publish } = useGame();
  const { name, getComponent, transform } = useGameObject();
  const findPath = usePathfinding();
  const [path, setPath] = useState<Position[]>([]);
  const [pathOverlayEnabled, setPathOverlayEnabled] = useState(true);
  const [canMove, setCanMove] = useState(false);
  const [canAttack, setCanAttack] = useState(false);
  // const [posiblesMeleeAttack, setPosiblesMeleeAttack] = useState<Position[]>();
  const [possibleActionPositions, setGlowPositions] = useState<Position[]>([]);
  const [enableGlow, setEnableGlow] = useState(false);

  // mouse controls
  const pointer = usePointer();

  function possibleMovements(position: Position, mov: number): Position[] {
    const uniquePositions = [];

    // HORIZONTALES
    for (let i = mov; i > 0; i--) {
      uniquePositions.push({ x: position.x + i, y: position.y });
      uniquePositions.push({ x: position.x - i, y: position.y });
      uniquePositions.push({ x: position.x, y: position.y + i });
      uniquePositions.push({ x: position.x, y: position.y - i });
    }

    // DIAGONALES
    var movementLeft = mov;
    while (movementLeft >= 2) {
      uniquePositions.push({
        x: position.x + Math.round(movementLeft / 2),
        y: position.y + Math.round(movementLeft / 2)
      });
      uniquePositions.push({
        x: position.x - Math.round(movementLeft / 2),
        y: position.y - Math.round(movementLeft / 2)
      });
      uniquePositions.push({
        x: position.x + Math.round(movementLeft / 2),
        y: position.y - Math.round(movementLeft / 2)
      });
      uniquePositions.push({
        x: position.x - Math.round(movementLeft / 2),
        y: position.y + Math.round(movementLeft / 2)
      });
      movementLeft = movementLeft - 2;
    }

    return uniquePositions;
  }

  useGameEvent<MechaWillMoveEvent>(
    "mecha-will-move",
    event => {
      if (event.mechaId === name) {
        setCanMove(true);
        const movements = possibleMovements({ x: transform.x, y: transform.y }, 2);
        setGlowPositions(movements);
        setEnableGlow(true);
      }
    },
    [transform]
  );

  useGameEvent<MechaWillAttackEvent>(
    "mecha-will-attack",
    event => {
      if (event.mechaId === name) {
        setCanAttack(true);
        const movements = possibleMovements({ x: transform.x, y: transform.y }, 2);
        setGlowPositions(movements);
        setEnableGlow(true);
      }
    }, 
    [transform]
  );

  usePointerClick(async event => {
    if (event.button === 2) {
        setGlowPositions([]);
        setEnableGlow(false);
    }
    if (event.button === 0) {
      if (pointer.x === transform.x && pointer.y === transform.y) {
        // Chequear si este async no rompe nada...
        // Muestro el menu
        await getComponent<InteractableRef>("Interactable").interact({
          x: 7,
          y: 3
        });
      } else if (
        canMove &&
        possibleActionPositions.filter(pos => {
          return pos.x === pointer.x && pos.y === pointer.y;
        }).length > 0
      ) {
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
      } else if (
        canAttack && possibleActionPositions.filter(pos => {
          return pos.x === pointer.x && pos.y === pointer.y;
        }).length > 0
      ) {
        console.log("Sending event to attack");
        // Trying to attack the mecha rival
        await publish<MechaTryingAttackEvent>("mecha-trying-attack", {
          mechaAttacker: mecha,
          position: { x: pointer.x, y: pointer.y }
        } as unknown as MechaTryingAttackData);
      }
    }
  });

  const notifyMovement = async (mechaId, position) => {
    await publish<MechaDidMoveEvent>("mecha-did-move", {
      mechaId,
      position
    });
  };

  // walk the path
  useEffect(() => {
    setEnableGlow(false);
    // Ya me movi
    if (!path.length) {
      setCanMove(false);
      notifyMovement(name, { x: transform.x, y: transform.y });
      return;
    }

    const [nextPosition] = path;

    (async () => {
      const anyAction =
        // Si move da 0 es puede ser porque queres moverte a algo que tenes al lado
        (await getComponent<MoveableRef>("Moveable")?.move(nextPosition)) ||
        (path.length === 1 && // Sino me pude mover y  el path es 1 intento interactuar con lo que este al lado
          (await getComponent<InteractableRef>("Interactable")?.interact(
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
      {/* <PlayerPathOverlay
        path={path}
        pathVisible={pathOverlayEnabled}
        pointer={pointer}
      /> */}
      {enableGlow &&
        <MovementGlow movements={possibleActionPositions} />
      }
    </>
  );
}
