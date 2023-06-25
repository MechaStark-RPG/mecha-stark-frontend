import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import AssetLoader from '../@core/AssetLoader';
import Scene from '../@core/Scene';
import SceneManager from '../@core/SceneManager';
import AttackScene, { AttackSceneType } from '../scenes/AttackScene';
import soundData from '../soundData';
import spriteData from '../spriteData';
import VixenMapScene from '../scenes/VixenMap';
import { Turn, InitState, Mecha, Action } from '../@core/logic/GameState';
import useSocket from '../@core/socket/useSocket';
import useAuth from '../@core/auth/useAuth';
import useGameEvent from '../@core/useGameEvent';
import {
    MechaDidMoveEvent,
    MechaTryingAttackEvent,
    ProcessMechaAction,
    ProcessMechaActionEvent,
} from '../@core/logic/MechaEvent';
import { Position } from '../@core/GameObject';
import useGame from '../@core/useGame';
import { WalletData } from '../@core/auth/AuthContext';
import useSceneManager from '../@core/useSceneManager';
import { MechaData } from 'src/entities/MechaData';
import waitForMs from '../@core/utils/waitForMs';

const urls = [
    ...Object.values(spriteData).map(data => data.src),
    ...Object.values(soundData).map(data => data.src),
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

export interface HashMap<T> {
    [key: string]: T;
}

export type MechaActions = {
    alreadyMove?: boolean;
    alreadyAttack?: boolean;
};

export default function MechaRPGLogic({
    initState,
    isTurn,
    walletData,
    setTurn,
    sentTurn,
    incomingTurn,
}: GameLogicProps) {
    const { publish } = useGame();
    // Actual mechas..
    const [mechas, setMechas] = useState<Mecha[]>();
    // Save actions for the actual turn
    const [actions, setActions] = useState<Action[]>([]);
    // Helper variable to guarantee the order of executions from useEffects
    const [mechasInitialized, setMechasInitialized] = useState(false);
    const [restrictActionsMap, setRestrictActionsMap] = useState<HashMap<MechaActions>>(
        {}
    );

    const [renderAttackScene, setRenderAttackScene] = useState(false);
    const [attackerStats, setAttackerStats] = useState<MechaData>();
    const [receiverStats, setReceiverStats] = useState<MechaData>();

    const updateMechaActions = (mecha_id: string, actions: Partial<MechaActions>) => {
        setRestrictActionsMap(prevState => ({
            ...prevState,
            [mecha_id]: {
                ...(prevState[mecha_id] || {}),
                ...actions,
            },
        }));
    };

    const getMechaActionsByMechaId = (mecha_id: string): MechaActions => {
        const mechaActions = restrictActionsMap[mecha_id];
        if (mechaActions) {
            return mechaActions;
        } else {
            return { alreadyMove: false, alreadyAttack: false };
        }
    };

    useEffect(() => {
        if (incomingTurn && incomingTurn.idPlayer !== walletData.walletAddress) {
            const handleIncomingTurn = async () => {
                let updatedMechas = mechas;

                for (const action of incomingTurn.actions) {
                    console.log('Action: ', action);
                    await waitForMs(2000);

                    if (action.isMovement) {
                        await publish<ProcessMechaActionEvent>('process-mecha-action', {
                            action,
                        } as unknown as ProcessMechaAction);
                        await waitForMs(2000);
                        updatedMechas = mechas.map(m => {
                            if (m.id === action.idMecha) {
                                return { ...m, position: action.movement };
                            }
                            return m;
                        });
                        setMechas(updatedMechas);
                    } else if (action.isAttack) {
                        const maybeMecha = findMechaByPosition(action.attack);
                        const mechaAttacker = findMechaById(action.idMecha);
                        console.log(maybeMecha);
                        console.log(mechaAttacker);

                        const newHp = maybeMecha.hp - mechaAttacker.attack;
                        updatedMechas = updatedMechas.map(m => {
                            if (m === maybeMecha) {
                                return { ...m, hp: newHp };
                            }
                            return m;
                        });

                        setReceiverStats({
                            attributes: {
                                attack: maybeMecha.attack,
                                defense: maybeMecha.armor,
                                hp: maybeMecha.hp,
                                hpTotal: maybeMecha.hpTotal,
                            },
                            sprite: maybeMecha.color == 'blue' ? spriteData.blue : spriteData.yellow,
                        });
                        setAttackerStats({
                            attributes: {
                                attack: mechaAttacker.attack,
                                defense: mechaAttacker.armor,
                                hp: mechaAttacker.hp,
                                hpTotal: mechaAttacker.hpTotal,
                            },
                            sprite: mechaAttacker.color == 'blue' ? spriteData.blue : spriteData.yellow,
                        });
                        setRenderAttackScene(true);
                        setMechas(updatedMechas);
                    }
                }
            };
            handleIncomingTurn();
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
            setRestrictActionsMap({});
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
            const maybeMecha = mechas.filter(
                mecha =>
                    mecha.position.x === position.x && mecha.position.y === position.y
            );
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
        'mecha-did-move',
        mechaMovementData => {
            const { mechaId } = mechaMovementData;
            const newPosition = mechaMovementData.position;
            const maybeMecha = findMechaById(mechaId);

            if (maybeMecha != null) {
                if (getMechaActionsByMechaId(mechaId).alreadyMove) {
                    console.log('El mecha ', mechaId, ' ya se movio en este turno.');
                }
                // Significa que se movio
                if (differentsPosition(maybeMecha.position, newPosition)) {
                    const newAction: Action = {
                        idMecha: mechaId,
                        movement: newPosition,
                        isMovement: true,
                    } as unknown as Action;

                    const updatedMechas = mechas.map(m => {
                        if (m === maybeMecha) {
                            return { ...m, position: newPosition };
                        }
                        return m;
                    });

                    updateMechaActions(mechaId, { alreadyMove: true });
                    setMechas(updatedMechas);
                    setActions([...actions, newAction]);
                }
            }
        },
        [mechas, actions]
    );

    useGameEvent<MechaTryingAttackEvent>(
        'mecha-trying-attack',
        mechaTryingMovementData => {
            const { mechaAttacker, position } = mechaTryingMovementData;
            const maybeMecha = findMechaByPosition(position);

            if (getMechaActionsByMechaId(mechaAttacker.id).alreadyAttack) {
                console.log('El mecha ', mechaAttacker.id, ' ya ataco en este turno.');
            }

            if (maybeMecha) {
                const newHp = maybeMecha.hp - mechaAttacker.attack;
                const updatedMechas = mechas.map(m => {
                    if (m === maybeMecha) {
                        return { ...m, hp: newHp };
                    }
                    return m;
                });

                // TODO: ADD SPRITES TO MECHAS
                setReceiverStats({
                    attributes: {
                        attack: maybeMecha.attack,
                        defense: maybeMecha.armor,
                        hp: maybeMecha.hp,
                        hpTotal: maybeMecha.hpTotal,
                    },
                    sprite: maybeMecha.color == 'blue' ? spriteData.blue : spriteData.yellow,
                });
                setAttackerStats({
                    attributes: {
                        attack: mechaAttacker.attack,
                        defense: mechaAttacker.armor,
                        hp: mechaAttacker.hp,
                        hpTotal: mechaAttacker.hpTotal,
                    },
                    sprite: mechaAttacker.color == 'blue' ? spriteData.blue : spriteData.yellow,
                });

                setMechas(updatedMechas);
                setRenderAttackScene(true);

                const newAction: Action = {
                    idMecha: mechaAttacker.id,
                    attack: position,
                    isAttack: true,
                } as unknown as Action;

                updateMechaActions(mechaAttacker.id, { alreadyAttack: true });
                setActions([...actions, newAction]);
            }
        },
        [mechas, receiverStats, attackerStats]
    );

    useEffect(() => {
        if (sentTurn) {
            setTurn({ idPlayer: walletData.walletAddress, actions } as unknown as Turn);
        }
    }, [actions, sentTurn]);

    return (
        <>
            <AssetLoader urls={urls} placeholder="Loading assets ...">
                <SceneManager defaultScene="vixenMap">
                    <Scene id="vixenMap">
                        <VixenMapScene
                            mechas={mechas}
                            renderAttackScene={renderAttackScene}
                            mechaActions={getMechaActionsByMechaId}
                        />
                    </Scene>
                    <Scene id="attack">
                        {attackerStats && receiverStats && (
                            <AttackScene
                                setRenderAttackScene={setRenderAttackScene}
                                attackerStats={{
                                    attributes: attackerStats.attributes,
                                    sprite: attackerStats.sprite,
                                }}
                                receiverStats={{
                                    attributes: receiverStats.attributes,
                                    sprite: receiverStats.sprite,
                                }}
                                type={AttackSceneType.RANGE}
                            />
                        )}
                    </Scene>
                </SceneManager>
            </AssetLoader>
        </>
    );
}
