import React, { useState } from 'react';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import { useSound } from '../@core/Sound';
import Sprite from '../@core/Sprite';
// import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import soundData from '../soundData';
import spriteData from '../spriteData';
import Interactable, { InteractableRef, InteractionEvent } from '../@core/Interactable';
import usePointer from '../@core/usePointer';
import usePointerClick from '../@core/usePointerClick';
import useGameObject from '../@core/useGameObject';
import MenuOption from './MenuOption';

interface MenuScriptProps {
    setDisplayMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setOptions: React.Dispatch<React.SetStateAction<string[]>>;
    setOptionSelected: React.Dispatch<React.SetStateAction<string>>;
}

function MenuScript({ setDisplayMenu, setOptions, setOptionSelected }: MenuScriptProps) {
    const { getRef, transform } = useGameObject();
    const playSfx = useSound(soundData.eating);

    useGameObjectEvent<InteractionEvent>('interaction', other => {
        console.log('DISPLAYING MENU');
        const menuXPosition = other.transform.x + 2;
        const menuYPosition = other.transform.y + 1;
        getRef().transform.setX(menuXPosition);
        getRef().transform.setY(menuYPosition);
        // Dado el ref... creo sus posibles opciones

        setDisplayMenu(true);
        setOptions(['Cancelar', 'Moverse', 'Atacar']);

        playSfx(); // -0.6 + idx * 0.7
    });

    const pointer = usePointer();

    usePointerClick(async event => {
        if (event.button === 0) {
            // Si clickea otro lugar
            if (pointer.x === transform.x && pointer.y === transform.y - 1) {
                setOptionSelected('Atacar');
            }
            if (pointer.x === transform.x && pointer.y === transform.y) {
                setOptionSelected('Moverse');
            }
            if (pointer.x === transform.x && pointer.y + 1 === transform.y) {
                setOptionSelected('Cancelar');
            }

            if (pointer.x !== transform.x && pointer.y !== transform.y) {
                // Chequear si este async no rompe nada...
                // Muestro el menu
                // Vuelvo a las posiciones harcodeadas
                setDisplayMenu(false);
                getRef().transform.setX(7);
                getRef().transform.setY(3);
            }
        }
    });

    return null;
}

// Deshabilitarlo es matarlo
export default function Menu(props: GameObjectProps) {
    const name = `menu`; // fallback name required for persisted flag
    const [optionSelected, setOptionSelected] = useState('');
    const [options, setOptions] = useState([]);
    const [displayMenu, setDisplayMenu] = useState(false);

    const handleOptionSelect = (option: string) => {
        setOptionSelected(option);
    };

    return (
        <GameObject name={name} persisted {...props} layer="ui">
            {displayMenu && <Sprite {...spriteData.menu} scale={3.7} opacity={1} basic />}
            <Interactable />
            <MenuScript
                setDisplayMenu={setDisplayMenu}
                setOptions={setOptions}
                setOptionSelected={setOptionSelected}
            />
            {displayMenu && (
                <>
                    {options.map((option, idx) => (
                        <group key={idx}>
                            <MenuOption
                                text={option}
                                position={[0, -0.7 + idx * 0.9, 10]} // Ajusta las posiciones según el diseño deseado
                                isSelected={optionSelected === option}
                                onSelect={() => handleOptionSelect(option)}
                            />
                        </group>
                    ))}
                </>
            )}
        </GameObject>
    );
}
