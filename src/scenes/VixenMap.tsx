import React, { Fragment } from 'react';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import Player from '../entities/Player';
import Player2Mecha from '../entities/Player2Mecha';
import spriteData from '../spriteData';
import GraphicOriginal from '../@core/GraphicOriginal';

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

export default function VixenMapScene() {
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
            </GameObject>
            <Player x={3} y={12} />
            <GameObject x={3} y={8} layer="character">
                <Sprite {...spriteData.enemyMap} />
                <Collider />
                <Interactable />
                <ScenePortal name="attack" enterDirection={[-1, 0]} target="attack" />
            </GameObject>
        </>
    );
}