import React, { Fragment, useEffect } from 'react';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import Mecha from '../entities/Mecha';
import spriteData from '../spriteData';
import CameraFollowScript from '../components/CameraFollowScript';
import { Mecha as MechaType } from '../@core/logic/GameState';
import Menu from '../entities/Menu';
import MovementGlow from '../components/MovementGlow';
import useSceneManager from '../@core/useSceneManager';
import { HashMap, MechaActions } from '../components/MechaRPGLogic';
import GraphicOriginal from '../@core/GraphicOriginal';
import { Text } from 'drei';

const mapData = mapDataString(`
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
`);

const resolveMapTile: TileMapResolver = (type, x, y) => {
    const key = `${x}-${y}`;
    const position = { x, y };

    const floor = <GameObject key={key} {...position} layer="ground" />;

    switch (type) {
        case '·':
            return floor;
        case 'o':
            return <Fragment key={key}>{floor}</Fragment>;
        case '#':
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                </GameObject>
            );
        case 'W':
            return <Fragment key={key}>{floor}</Fragment>;
        case 'C':
            return <Fragment key={key}>{floor}</Fragment>;
        case 'T':
            return <Fragment key={key}>{floor}</Fragment>;
        default:
            return null;
    }
};

interface VixenMapProps {
    mechas: MechaType[];
    renderAttackScene: boolean;
    mechaActions: (mecha_id: string) => MechaActions;
}

export default function VixenMapScene({ mechas, renderAttackScene, mechaActions }: VixenMapProps) {
    const { setScene } = useSceneManager();

    useEffect(() => {
        if (renderAttackScene) {
            setScene('attack');
        }
    }, [renderAttackScene]);

    return (
        <>
            <GameObject>
                <GraphicOriginal
                    {...spriteData.vixenMap}
                    offset={{ x: 15.47, y: 7.3 }}
                    customScale={{ width: 31.37, height: 15.7, z: 1 }}
                    opacity={1}
                    basic
                />
            </GameObject>
            <GameObject name="map">
                <ambientLight />
                <TileMap data={mapData} resolver={resolveMapTile} definesMapSize />
                <CameraFollowScript />
            </GameObject>

            {mechas.map(mecha => {
                return (
                    <>
                        <Text
                            anchorX="center"
                            anchorY="middle"
                            position={[mecha.position.x, mecha.position.y - 0.3, 0.1]}
                            fontSize={0.2}
                            color="white"
                            applyMatrix4={null}
                        >{`${mecha.hp} / ${mecha.hpTotal}`}</Text>
                        <Mecha
                            mecha={mecha}
                            mechaId={mecha.id}
                            x={mecha.position.x}
                            y={mecha.position.y}
                            isTurn={mecha.isReady}
                        />
                        {mechaActions && !mechaActions(mecha.id).alreadyAttack &&
                            <group position={[mecha.position.x + 0.45, mecha.position.y + 0.7, 2]}>
                                <GraphicOriginal
                                    {...spriteData.attackFlag}
                                    customScale={ {width: 0.20, height: 0.25, z: 0.5}}
                                    opacity={1}
                                    basic
                                />
                            </group>
                        }
                        {mechaActions && !mechaActions(mecha.id).alreadyMove &&
                            <group position={[mecha.position.x + 0.45, mecha.position.y + 0.45, 2]}>
                                <GraphicOriginal
                                    {...spriteData.moveFlag}
                                    customScale={ {width: 0.20, height: 0.25, z: 0.5}}
                                    opacity={1}
                                    basic
                                />
                            </group>
                        }
                    </>
                );
            })}

            <Menu />

            <GameObject x={3} y={8} layer="character">
                <Sprite {...spriteData.enemyMap} />
                <Collider />
                <Interactable />
                <ScenePortal name="attack" enterDirection={[-1, 0]} target="attack" />
            </GameObject>
        </>
    );
}
