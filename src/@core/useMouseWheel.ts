import { useEffect } from 'react';
import { useThree } from 'react-three-fiber';
import useGame from './useGame';

export default function useMouseWheel(clickCallback: (event: WheelEvent) => void) {
    const {
        gl: { domElement },
    } = useThree();
    const { paused } = useGame();

    useEffect(() => {
        function handleWheel(event: WheelEvent) {
            if (paused) return;
            clickCallback(event);
        }
        domElement.addEventListener('wheel', handleWheel);
        return () => {
            domElement.removeEventListener('wheel', handleWheel);
        };
    }, [paused, clickCallback, domElement]);
}
