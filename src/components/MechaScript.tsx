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
  const [posiblesMeleeAttack, setPosiblesMeleeAttack] = useState<Position[]>();
  const [possiblesMovements, setPossiblesMovements] = useState<Position[]>([]);

  // mouse controls
  const pointer = usePointer();

  const getPositions = (x, y) => {
    const horizontal: Position[] = [];
    const vertical: Position[] = [];
    const diagonals: Position[] = [];

    // Posiciones horizontales
    for (let i = x - 5; i <= x + 5; i++) {
      horizontal.push({ x: i, y });
    }

    // Posiciones verticales
    for (let i = y - 5; i <= y + 5; i++) {
      vertical.push({ x, y: i });
    }

    // Diagonal superior izquierda a inferior derecha
    for (let i = -5; i <= 5; i++) {
      const diagonalX = x + i;
      const diagonalY = y + i;
      diagonals.push({ x: diagonalX, y: diagonalY });
    }

    // Diagonal superior derecha a inferior izquierda
    for (let i = -5; i <= 5; i++) {
      const diagonalX = x - i;
      const diagonalY = y + i;
      diagonals.push({ x: diagonalX, y: diagonalY });
    }

    // Obtener los valores dentro de las diagonales
    const diagonalValues: Position[][] = diagonals.map(diagonal => {
      const values = [];
      const startX = diagonal.x < diagonal.y ? diagonal.x : diagonal.y;
      const endX = diagonal.x > diagonal.y ? diagonal.x : diagonal.y;

      for (let i = startX; i <= endX; i++) {
        const diagonalY = diagonal.y + (i - diagonal.x);
        values.push({ x: i, y: diagonalY });
      }

      return values;
    });

    const allValues = horizontal
      .concat(vertical)
      .concat(Array.prototype.concat.apply([], diagonalValues));

    return allValues;
  };

  useGameEvent<MechaWillMoveEvent>(
    "mecha-will-move",
    event => {
      if (event.mechaId === name.replace("mecha", "")) {
        setCanMove(true);
        const movements = getPositions(transform.x, transform.y);
        setPossiblesMovements(movements);
      }
    },
    []
  );

  useGameEvent<MechaWillAttackEvent>(
    "mecha-will-attack", (event) => {
      if (event.mechaId === name.replace("mecha", "")) {
        // Merge con lo de Dub
        const meleeMovements = [...Array(mecha.attackMeeleDistance).keys()].map(delta => {
          return { x: transform.x + 1 + delta, y: transform.y };
        });
        setPosiblesMeleeAttack(meleeMovements);
      }
    }, []);

  usePointerClick(async event => {
    // Click derecho
    if (event.button === 0) {
      // Si se cliquea a si mismo

      if (pointer.x === transform.x && pointer.y === transform.y) {
        // Chequear si este async no rompe nada...
        // Muestro el menu
        console.log("Tengo que mostrar el menu");
        await getComponent<InteractableRef>("Interactable").interact({
          x: 7,
          y: 3
        });
      } else if (
        canMove &&
        possiblesMovements.filter(pos => {
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
        canAttack && posiblesMeleeAttack.filter(pos => {
          return pos.x === pointer.x && pos.y === pointer.y;
        }).length > 0
      ) {
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
    <PlayerPathOverlay
      path={path}
      pathVisible={pathOverlayEnabled}
      pointer={pointer}
    />
  );
}
