import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import AssetLoader from "../@core/AssetLoader";
import Scene from "../@core/Scene";
import SceneManager from "../@core/SceneManager";
import AttackScene, { AttackSceneType } from "../scenes/AttackScene";
import soundData from "../soundData";
import spriteData from "../spriteData";
import VixenMapScene from "../scenes/VixenMap";
import { Turn, InitState, Mecha, Action } from "../@core/logic/GameState";
import useSocket from "../@core/socket/useSocket";
import useAuth from "../@core/auth/useAuth";
import useGameEvent from "../@core/useGameEvent";
import {
  MechaDidMoveEvent, MechaTryingAttackEvent,
  ProcessMechaAction,
  ProcessMechaActionEvent
} from "../@core/logic/MechaEvent";
import { Position } from "../@core/GameObject";
import useGame from "../@core/useGame";
import { WalletData } from "../@core/auth/AuthContext";

const urls = [
  ...Object.values(spriteData).map(data => data.src),
  ...Object.values(soundData).map(data => data.src)
  // flatten
].reduce<string[]>((acc, val) => acc.concat(val), []);

interface GameLogicProps {
  initState: InitState;
  isTurn: boolean;
  walletData: WalletData;
  setTurn: Dispatch<SetStateAction<Turn>>;
  sentTurn: boolean;
  incomingTurn: Turn;
}

export default function MechaRPGLogic({
                                        initState,
                                        isTurn,
                                        walletData,
                                        setTurn,
                                        sentTurn,
                                        incomingTurn
                                      }: GameLogicProps) {
  const { publish } = useGame();
  // Actual mechas..
  const [mechas, setMechas] = useState<Mecha[]>();
  // Save actions for the actual turn
  const [actions, setActions] = useState<Action[]>([]);
  // Helper variable to guarantee the order of executions from useEffects
  const [mechasInitialized, setMechasInitialized] = useState(false);

  const [renderAttackScene, setRenderAttackScene] = useState(false);

  useEffect(() => {
    if (incomingTurn) {
      incomingTurn.actions.forEach(action => {
        publish<ProcessMechaActionEvent>("process-mecha-action", ({
          action
        } as unknown) as ProcessMechaAction);
      });
    }
  }, [incomingTurn]);

  // Agarro todos los mechas para mostrarlos en el mapa
  useEffect(() => {
    // setMechasState(initState.mechas);
    const mechasFromAllPlayers = initState.players
      .map(player => player.mechas)
      .reduce((m1, m2) => m1.concat(m2), []);
    setMechas(mechasFromAllPlayers);
    setMechasInitialized(true);
  }, []);

  // Habilito los mechas del player si y solo si tiene el turno habilitado
  useEffect(() => {
    if (mechasInitialized) {
      const enabledMechas = mechas.map(mecha => {
        if (mecha.idOwner === walletData.walletAddress) {
          return { ...mecha, isReady: true };
        }
        return mecha;
      });

      setMechas(enabledMechas);
    }
  }, [isTurn, mechasInitialized]);

  useEffect(() => {
    if (isTurn) {
      setActions([]);
    }
  }, [isTurn]);

  const findMechaById = useCallback(
    mechaId => {
      const maybeMecha = mechas.filter(mecha => mecha.id === mechaId);
      if (maybeMecha.length > 0) {
        return maybeMecha[0];
      }
      return null;
    },
    [mechas]
  );

  const findMechaByPosition = useCallback(
    (position: Position) => {
      const maybeMecha = mechas.filter(mecha => mecha.position.x === position.x && mecha.position.y === position.y);
      if (maybeMecha.length > 0) {
        return maybeMecha[0];
      }
      return null;
    },
    [mechas]
  );


  const differentsPosition = (position1: Position, position2: Position) => {
    return position1.x !== position2.x || position1.y !== position2.y;
  };

  // Me guardo la action de que el mecha se movio
  useGameEvent<MechaDidMoveEvent>(
    "mecha-did-move",
    mechaMovementData => {
      const { mechaId } = mechaMovementData;
      const newPosition = mechaMovementData.position;
      const maybeMecha = findMechaById(mechaId);

      if (maybeMecha != null) {
        // Significa que se movio
        if (differentsPosition(maybeMecha.position, newPosition)) {
          const newAction: Action = ({
            idMecha: mechaId,
            movement: newPosition,
            isMovement: true
          } as unknown) as Action;
          //TODO: Review
          setMechas([...mechas, { ...maybeMecha, position: newPosition }]);
          setActions([...actions, newAction]);
        }
      }
    },
    [mechas, actions]
  );

  useGameEvent<MechaTryingAttackEvent>(
    "mecha-trying-attack",
    mechaTryingMovementData => {
      const { mechaAttacker, position } = mechaTryingMovementData;
      const maybeMecha = findMechaByPosition(position);
      if (maybeMecha) {
        const newHp = maybeMecha.hp - mechaAttacker.attack;
        //TODO: Review
        setMechas([...mechas, { ...maybeMecha, hp: newHp }]);
        setRenderAttackScene(true);
        // Mostrar la animacion
        // Guardar el action y mandarlo
      }
    }, [mechas]);

  useEffect(() => {
    if (sentTurn) {
      setTurn(({ idPlayer: walletData.walletAddress, actions } as unknown) as Turn);
    }
  }, [actions, sentTurn]);

  return (
    <>
      <AssetLoader urls={urls} placeholder="Loading assets ...">
        <SceneManager defaultScene="vixenMap">
          <Scene id="vixenMap">
            <VixenMapScene mechas={mechas} />
          </Scene>
        </SceneManager>
        {renderAttackScene && <AttackScene
          attackerStats={{
            attributes: {
              hp: 100,
              hpTotal: 100,
              attack: 80,
              defense: 20
            },
            sprite: spriteData.yellow
          }}
          receiverStats={{
            attributes: {
              hp: 200,
              hpTotal: 200,
              attack: 24,
              defense: 35
            },
            sprite: spriteData.blue
          }}
          type={AttackSceneType.RANGE}
        />}
      </AssetLoader>
    </>
  );
}
