import React, { Fragment } from 'react';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import Mecha from '../entities/Mecha';
import spriteData from '../spriteData';
import GraphicOriginal from '../@core/GraphicOriginal';
import CameraFollowScript from '../components/CameraFollowScript';
import { Mecha as MechaType } from '../@core/logic/GameState';
import Menu from '../entities/Menu';

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
}

export default function VixenMapScene({ mechas }: VixenMapProps) {
    return (
        <>
            <GameObject>
                <GraphicOriginal
                    {...spriteData.vixenMap}
                    offset={{ x: 15.47, y: 7.3 }}
                    customScale={{ width: 31.37, height: 15.7, z: 0 }}
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
                    <Mecha
                        mechaId={mecha.id}
                        x={mecha.position.x}
                        y={mecha.position.y}
                        isTurn={mecha.isReady}
                    />
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
