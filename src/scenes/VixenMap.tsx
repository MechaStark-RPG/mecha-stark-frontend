import React, { Fragment } from 'react';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import CoffeeMachine from '../entities/CoffeeMachine';
import PizzaPickup from '../entities/PizzaPickup';
import Plant from '../entities/Plant';
import Player from '../entities/Player';
import Workstation from '../entities/Workstation';
import spriteData from '../spriteData';
import Menu from '../entities/Menu';
import GraphicOriginal from '../@core/GraphicOriginal';
import CameraFollowScript from '../components/CameraFollowScript';

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
            <GameObject name="map">
                <ambientLight />
                <TileMap data={mapData} resolver={resolveMapTile} definesMapSize />
            </GameObject>
            <Player x={3} y={12} />
            <GameObject>
                <GraphicOriginal
                    {...spriteData.vixenMap}
                    offset={{ x: 15.5, y: 7.5 }}
                    customScale={{ width: 31, height: 15, z: 0 }}
                    opacity={1}
                    basic
                />
            </GameObject>
        </>
    );
}
