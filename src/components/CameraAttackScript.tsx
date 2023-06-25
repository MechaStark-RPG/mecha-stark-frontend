import { useRef, useEffect } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Position } from '../@core/GameObject';
import { SceneReadyEvent } from '../@core/Scene';
import useGameEvent from '../@core/useGameEvent';

interface CameraAttackScriptProps {
    attackerPosition: Position;
}

export default function CameraAttackScript({
    attackerPosition,
}: CameraAttackScriptProps) {
    const { camera } = useThree();
    const isReady = useRef(false);

    useGameEvent<SceneReadyEvent>('scene-ready', () => {
        isReady.current = true;
    });

    useEffect(() => {
        camera.zoom = 75;
        camera.updateProjectionMatrix();
    }, []);

    useFrame(() => {
        camera.position.setX(attackerPosition.x);
        camera.position.setY(attackerPosition.y);
    });

    return null;
}
