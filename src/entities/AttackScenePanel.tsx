import React from 'react';
import { Text } from 'drei';
import GameObject, { Position } from '../@core/GameObject';
import spriteData from '../spriteData';
import GraphicOriginal from '../@core/GraphicOriginal';
import { MechaData } from '../entities/MechaData';

interface GameObjectProps {
    position: Position;
    attackerStats: MechaData;
    receiverStats: MechaData;
}

function obtainMechaTypeFromSprite(spriteSrc: string) {
    if (spriteSrc.includes('yellow')) {
        return spriteData.yellowPhoto;
    }
    if (spriteSrc.includes('blue')) {
        return spriteData.bluePhoto;
    }
    return spriteData.yellowPhoto;
}

export default function AttackScenePanel({
    position,
    attackerStats,
    receiverStats,
}: GameObjectProps) {
    console.log(
        'receiver: ',
        receiverStats.sprite.src,
        ' mecha?',
        obtainMechaTypeFromSprite(receiverStats.sprite.src)
    );
    console.log(
        'attacker: ',
        attackerStats.sprite.src,
        ' mecha?',
        obtainMechaTypeFromSprite(attackerStats.sprite.src)
    );
    return (
        <group>
            <GameObject>
                <GraphicOriginal
                    {...spriteData.menuBackground}
                    offset={{ x: position.x, y: position.y - 4 }}
                    customScale={{ width: 40, height: 4, z: 1 }}
                    opacity={1}
                    basic
                />
                <GraphicOriginal
                    {...spriteData.menuAttack}
                    offset={{ x: position.x, y: position.y - 4 }}
                    customScale={{ width: 24, height: 4, z: 1 }}
                    opacity={1}
                    basic
                />
            </GameObject>
            <GameObject>
                <GraphicOriginal
                    {...obtainMechaTypeFromSprite(attackerStats.sprite.src)}
                    offset={{ x: position.x - 10, y: position.y - 4 }}
                    customScale={{ width: 2, height: 2, z: 1 }}
                    opacity={1}
                    basic
                />
                <GraphicOriginal
                    {...obtainMechaTypeFromSprite(receiverStats.sprite.src)}
                    offset={{ x: position.x + 2, y: position.y - 4 }}
                    customScale={{ width: 2, height: 2, z: 1 }}
                    opacity={1}
                    basic
                />
            </GameObject>
            <GameObject>
                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[position.x - 6.5, position.y - 4, 0.1]}
                    fontSize={0.45}
                    color="white"
                    applyMatrix4={null}
                >
                    {`HP: ${attackerStats.attributes.hp} / ${attackerStats.attributes.hpTotal}\n\n`}
                    {`Attack: ${attackerStats.attributes.attack} pts\n`}
                    {`Defense: ${attackerStats.attributes.defense} pts`}
                </Text>
                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[position.x + 5.5, position.y - 4, 0.1]}
                    fontSize={0.45}
                    color="white"
                    applyMatrix4={null}
                >
                    {`HP: ${receiverStats.attributes.hp} / ${receiverStats.attributes.hpTotal}\n\n`}
                    {`Attack: ${receiverStats.attributes.attack} pts\n`}
                    {`Defense: ${receiverStats.attributes.defense} pts`}
                </Text>
            </GameObject>
        </group>
    );
}
