import React, { Dispatch, SetStateAction } from 'react';
import GameObject from '../@core/GameObject';
import AttackMeeleScene from './AttackMeeleScene';
import AttackRangeScene from './AttackRangeScene';
import { MechaData } from '../entities/MechaData';

export enum AttackSceneType {
    RANGE = 'range',
    MEELE = 'meele',
}

interface AttackSceneProps {
    attackerStats: MechaData;
    receiverStats: MechaData;
    type: AttackSceneType;
    setRenderAttackScene: Dispatch<SetStateAction<boolean>>;
}

export default function AttackScene({
    attackerStats,
    receiverStats,
    type,
    setRenderAttackScene,
}: AttackSceneProps) {
    return (
        <GameObject name="attackScene">
            {type === AttackSceneType.MEELE && (
                <AttackMeeleScene
                    attackerStats={attackerStats}
                    receiverStats={receiverStats}
                />
            )}
            {type === AttackSceneType.RANGE && (
                <AttackRangeScene
                    attackerStats={attackerStats}
                    receiverStats={receiverStats}
                    setRenderAttackScene={setRenderAttackScene}
                />
            )}
        </GameObject>
    );
}
