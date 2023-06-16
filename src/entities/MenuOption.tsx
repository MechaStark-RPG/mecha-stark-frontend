import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { Text } from 'drei';

interface MenuOptionProps {
    text: string;
    position: [number, number, number];
    isSelected: boolean;
    onSelect: () => void;
}

export default function MenuOption({
    text,
    position,
    isSelected,
    onSelect,
}: MenuOptionProps) {
    const meshRef = useRef<THREE.Mesh>();

    // Cambiar el color cuando está seleccionado
    const color = isSelected ? 'yellow' : 'white';

    return (
        <>
            <mesh position={position} onClick={onSelect}>
                <boxBufferGeometry args={[2, 0.5, 10]} />
                <meshStandardMaterial color="blue" />
                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0, 10]}
                    fontSize={0.3}
                    color="white"
                    applyMatrix4={null}
                >
                    {text}
                </Text>
            </mesh>
        </>
    );
}
