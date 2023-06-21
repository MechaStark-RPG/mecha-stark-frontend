import React from 'react';
import { Text } from 'drei';
import GameObject, { Position } from '../@core/GameObject';
import spriteData from '../spriteData';
import GraphicOriginal from '../@core/GraphicOriginal';
import { MechaAttributes } from '../entities/MechaData';

interface GameObjectProps {
    position: Position;
    attackerStats: MechaAttributes;
    receiverStats: MechaAttributes;
}

export default function AttackScenePanel({
    position,
    attackerStats,
    receiverStats,
}: GameObjectProps) {
    return (
        <group>
            <GameObject>
                <GraphicOriginal
                    {...spriteData.menuBackground}
                    offset={{ x: position.x, y: position.y - 4 }}
                    customScale={{ width: 40, height: 4, z: 0 }}
                    opacity={1}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.menuAttack}
                    offset={{ x: position.x, y: position.y - 4 }}
                    customScale={{ width: 24, height: 4, z: 0 }}
                    opacity={1}
                    basic
                />
            </GameObject>
            <GameObject>
                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[position.x - 7.5, position.y - 4, 0.1]}
                    fontSize={0.5}
                    color="white"
                    applyMatrix4={null}
                >
                    HP: {attackerStats.hp} / {attackerStats.hpTotal} {'\n\n'}
                    Attack: {attackerStats.attack} pts {'\n'}
                    Defense: {attackerStats.defense} pts
                </Text>
                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[position.x + 4.5, position.y - 4, 0.1]}
                    fontSize={0.5}
                    color="white"
                    applyMatrix4={null}
                >
                    HP: {receiverStats.hp} / {receiverStats.hpTotal} {'\n\n'}
                    Attack: {receiverStats.attack} pts {'\n'}
                    Defense: {receiverStats.defense} pts
                </Text>
            </GameObject>
        </group>
    );
}
