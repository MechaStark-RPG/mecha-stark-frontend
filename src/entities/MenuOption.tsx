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
            <mesh ref={meshRef} position={position} onClick={onSelect}>
                <boxBufferGeometry args={[2, 0.5, 0.5]} />
                <meshStandardMaterial color={color} />
                <Text
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0, 0.1]}
                    fontSize={0.3}
                    applyMatrix4="asd"
                >
                    {text}
                </Text>
            </mesh>
        </>
    );
}
