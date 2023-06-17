import { useCallback, useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { Position } from '../@core/GameObject';
import { SceneReadyEvent } from '../@core/Scene';
import useGame from '../@core/useGame';
import useGameEvent from '../@core/useGameEvent';
import useGameObject from '../@core/useGameObject';
import useKeyActions from '../@core/useKeyActions';
import usePointer from '../@core/usePointer';
import useMouseWheel from '../@core/useMouseWheel';
import AttackScene from 'src/scenes/AttackScene';

function getRoundedCameraPosition(camera: THREE.Camera) {
    const vector = camera.position.clone();
    // world to rounded screen position
    vector.project(camera);
    vector.x = Math.round(((vector.x + 1) * window.innerWidth) / 2);
    vector.y = Math.round(((-vector.y + 1) * window.innerHeight) / 2);
    // screen to world position
    vector.set(
        (vector.x / window.innerWidth) * 2 - 1,
        -(vector.y / window.innerHeight) * 2 + 1,
        0.5
    );
    return vector.unproject(camera);
}

interface CameraAttackScriptProps {
    attackerPosition: Position;
}

export default function CameraAttackScript({
    attackerPosition,
}: CameraAttackScriptProps) {
    const {
        mapSize: [mapWidth, mapHeight],
        settings: { cameraZoom },
    } = useGame();
    const { camera } = useThree();
    const isReady = useRef(false);

    useGameEvent<SceneReadyEvent>('scene-ready', () => {
        isReady.current = true;
    });

    useEffect(() => {
        console.log('useEffect() - CameraAttackScript');
    }, []);

    // following camera
    useFrame(() => {
        camera.position.setX(attackerPosition.x);
        camera.position.setY(attackerPosition.y);
        camera.updateProjectionMatrix();
    });

    return null;
}
