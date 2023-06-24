import React, { useCallback, useEffect, useState } from 'react';
import AssetLoader from '../@core/AssetLoader';
import Scene from '../@core/Scene';
import SceneManager from '../@core/SceneManager';
import AttackScene from '../scenes/AttackScene';
import soundData from '../soundData';
import spriteData from '../spriteData';
import VixenMapScene from '../scenes/VixenMap';
import { Turn, InitState, Mecha, Action } from '../@core/logic/GameState';
import useSocket from '../@core/socket/useSocket';
import useAuth from '../@core/auth/useAuth';
import useGameEvent from '../@core/useGameEvent';
import { MechaDidMoveEvent } from '../@core/logic/MechaEvent';
import { Position } from '../@core/GameObject';

const urls = [
    ...Object.values(spriteData).map(data => data.src),
    ...Object.values(soundData).map(data => data.src),
    // flatten
].reduce<string[]>((acc, val) => acc.concat(val), []);

interface GameLogicProps {
    initState: InitState;
    isTurn: boolean;
    username: string;
}

export default function MechaRPGLogic({ initState, isTurn, username }: GameLogicProps) {
    const [turns, setTurns] = useState<Turn[]>([]);
    // Logica para saber que ocurre con el mecha actualmente
    const [mechas, setMechas] = useState<Mecha[]>();
    const [actions, setActions] = useState<Action[]>([]);
    // Variable helper para inicializar los mechas y que los effects se ejecuten en orden
    const [mechasInitialized, setMechasInitialized] = useState(false);

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
                if (mecha.idOwner === username) {
                    return { ...mecha, isReady: true };
                }
                return mecha;
            });

            setMechas(enabledMechas);
        }
    }, [isTurn, mechasInitialized]);

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

            console.log('Se movio el mecha!!.. Guardando el action');

            if (maybeMecha != null) {
                // Significa que se movio
                if (differentsPosition(maybeMecha.position, newPosition)) {
                    const newAction: Action = ({
                        idMecha: mechaId,
                        movement: newPosition,
                    } as unknown) as Action;
                    setActions([...actions, newAction]);
                }
            }
        },
        [mechas]
    );

    return (
        <>
            <AssetLoader urls={urls} placeholder="Loading assets ...">
                <SceneManager defaultScene="vixenMap">
                    <Scene id="attack">
                        <AttackScene />
                    </Scene>
                    <Scene id="vixenMap">
                        <VixenMapScene mechas={mechas} />
                    </Scene>
                </SceneManager>
            </AssetLoader>
        </>
    );
}
