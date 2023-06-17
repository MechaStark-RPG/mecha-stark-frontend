import React, { useRef, useEffect } from 'react';
import { useFrame } from 'react-three-fiber';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Sprite from '../@core/Sprite';

interface GifGameObjectProps extends GameObjectProps {
    gifSrc: string;
}

const GifGameObject = ({ gifSrc, ...props }: GifGameObjectProps) => {
    const gifRef = useRef<HTMLImageElement>();

    useEffect(() => {
        function handleGifLoad() {
            // Realiza cualquier acción adicional después de que el gif se haya cargado
        }

        if (gifRef.current) {
            gifRef.current.src = gifSrc;
            gifRef.current.addEventListener('load', handleGifLoad);
        }

        return () => {
            if (gifRef.current) {
                gifRef.current.removeEventListener('load', handleGifLoad);
            }
        };
    }, [gifSrc]);

    useFrame(({ clock }) => {
        const { elapsedTime } = clock;

        // Lógica de animación que se ejecuta en cada frame
        // Utiliza elapsedTime para controlar la progresión de la animación en función del tiempo transcurrido

        if (elapsedTime > 10) {
            // La animación ha durado 10 segundos, puedes detenerla o hacer cualquier otra acción aquí
        }
    });

    return (
        <GameObject {...props}>
            <sprite>
                <spriteMaterial>
                    <canvasTexture ref={gifRef} />
                </spriteMaterial>
            </sprite>
        </GameObject>
    );
};

export default GifGameObject;
