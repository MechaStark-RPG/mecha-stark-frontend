import { useCallback, useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";
import { Position } from "../@core/GameObject";
import { SceneReadyEvent } from "../@core/Scene";
import useGame from "../@core/useGame";
import useGameEvent from "../@core/useGameEvent";
import useGameObject from "../@core/useGameObject";
import useKeyActions from "../@core/useKeyActions";
import usePointer from "../@core/usePointer";
import useMouseWheel from "../@core/useMouseWheel";

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

export default function CameraFollowScript() {
  const {
    mapSize: [mapWidth, mapHeight],
    settings: { cameraZoom }
  } = useGame();
  const { nodeRef } = useGameObject();
  const { camera } = useThree();
  const isReady = useRef(false);
  const zoomLevel = useRef(0);
  const [isMouseAtEdge, setIsMouseAtEdge] = useState(false);
  const [cameraOffsetX, setCameraOffsetX] = useState(0);
  const [cameraOffsetY, setCameraOffsetY] = useState(0);
  const pointer = usePointer();
  const [cameraZoomLevels] = useState(() => [
    cameraZoom,
    cameraZoom * 1.1,
    cameraZoom * 1.2,
    cameraZoom * 1.3,
    cameraZoom * 2,
    cameraZoom * 3
  ]);

  const clampPositionToViewport = useCallback(
    (position: Position) => {
      const extraTopSpace = 3;
      const extraBottomSpace = 3;
      const extraHorizontalSpace = 6;
      const viewport = new THREE.Vector3(1, 1)
        .unproject(camera)
        .sub(camera.position);
      let { x, y } = position;
      if (mapWidth > viewport.x * 2 - extraHorizontalSpace * 2) {
        x = Math.max(
          viewport.x - 0.5 - extraHorizontalSpace,
          Math.min(x, mapWidth - viewport.x - 0.5 + extraHorizontalSpace)
        );
      } else {
        x = mapWidth / 2 - 0.5;
      }

      if (mapHeight > viewport.y * 2 - extraTopSpace - extraBottomSpace) {
        y = Math.max(
          viewport.y - 0.5 - extraBottomSpace,
          Math.min(y, mapHeight - viewport.y - 0.5 + extraTopSpace)
        );
      } else {
        y = mapHeight / 2 - 0.5;
      }

      return { x, y };
    },
    [camera, mapHeight, mapWidth]
  );

  useGameEvent<SceneReadyEvent>("scene-ready", () => {
    isReady.current = true;
  });

  useMouseWheel(async event => {
    if (event.deltaY === -120) {
      const maxLevel = cameraZoomLevels.length - 1;
      zoomLevel.current = Math.min(maxLevel, zoomLevel.current + 1);
    } else if (event.deltaY === 120) {
      zoomLevel.current = Math.max(0, zoomLevel.current - 1);
    }
  });

  useKeyActions({
    ArrowUp: e => {
      e.preventDefault();
      camera.position.setY(camera.position.y + 1);
    },
    ArrowDown: e => {
      e.preventDefault();
      camera.position.setY(camera.position.y - 1);
    },
    ArrowLeft: e => {
      e.preventDefault();
      camera.position.setX(camera.position.x - 1);
    },
    ArrowRight: e => {
      e.preventDefault();
      camera.position.setX(camera.position.x + 1);
    },
    " ": e => {
      e.preventDefault();
      camera.position.setX(15);
      camera.position.setY(7);
    }
  });

  useEffect(() => {
    const handleMouseMove = event => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const xThreshold = 10; // Márgenes horizontales
      const yThreshold = 10; // Márgenes verticales
      const offsetX = event.clientX - innerWidth / 2;
      const offsetY = event.clientY - innerHeight / 2;


      // Verifica si el puntero del mouse está en el borde
      const isMouseAtEdgeX =
        clientX <= xThreshold || clientX >= innerWidth - xThreshold;
      const isMouseAtEdgeY =
        clientY <= yThreshold || clientY >= innerHeight - yThreshold;

      setIsMouseAtEdge(isMouseAtEdgeX || isMouseAtEdgeY);

      // Actualiza el desplazamiento de la cámara solo si el puntero del mouse está en el borde
      if (isMouseAtEdgeX) {
        if (offsetX > 0) {
          setCameraOffsetX(0.3);
          setCameraOffsetY(0);
        } else if (offsetX < 0) {
          setCameraOffsetX(-0.3);
          setCameraOffsetY(0);
        }
      } else if (isMouseAtEdgeY) {
        if (offsetY > 0) {
          setCameraOffsetY(-0.3);
          setCameraOffsetX(0);
        } else if (offsetY < 0) {
          setCameraOffsetY(0.3);
          setCameraOffsetX(0);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // following camera
  useFrame(() => {
    if (isMouseAtEdge) {
      if (
        (cameraOffsetX < 0 && pointer.x > -2) ||
        (cameraOffsetX > 0 && pointer.x < mapWidth + 1)
      ) {
        camera.position.setX(camera.position.x + cameraOffsetX);
      }
      if (
        (cameraOffsetY < 0 && pointer.y > -2) ||
        (cameraOffsetY > 0 && pointer.y < mapHeight + 1)
      ) {
        camera.position.setY(camera.position.y + cameraOffsetY);
      }
    }

    const { x, y } = clampPositionToViewport(nodeRef.current.position);

    if (!isReady.current) {
      // set camera to player node initially
      camera.position.setX(x);
      camera.position.setY(y);
    } else {
      // follow x, y
      // if (
      //     Math.round(camera.position.x * 100) !== Math.round(x * 100) ||
      //     Math.round(camera.position.y * 100) !== Math.round(y * 100)
      // ) {
      //     // camera.position.setX(camera.position.x - (camera.position.x - x) / 8);
      //     // camera.position.setY(camera.position.y - (camera.position.y - y) / 8);
      // } else {
      //     // camera.position.setX(x);
      //     // camera.position.setY(y);
      // }
      // apply zoom
      const prevZoom = camera.zoom;
      camera.zoom = cameraZoomLevels[zoomLevel.current];
      if (camera.zoom !== prevZoom) camera.updateProjectionMatrix();
    }

    // avoid camera position on floating screen pixels
    // const rounded = getRoundedCameraPosition(camera);
    // camera.position.setX(rounded.x);
    // camera.position.setY(rounded.y);
  });

  return null;
}
