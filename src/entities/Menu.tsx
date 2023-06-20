import React, { useState } from 'react';
import GameObject, { GameObjectProps, Position } from '../@core/GameObject';
import { useSound } from '../@core/Sound';
// import Sprite from '../@core/Sprite';
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
    setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
    setOptionSelected: React.Dispatch<React.SetStateAction<string>>;
    options: Option[];
}

type Option = {
    name: string;
    position: Position;
};

function MenuScript({
    setDisplayMenu,
    setOptions,
    setOptionSelected,
    options,
}: MenuScriptProps) {
    const { getRef, transform } = useGameObject();
    const playSfx = useSound(soundData.eating);

    useGameObjectEvent<InteractionEvent>('interaction', player => {
        const menuXPosition = player.transform.x + 2;
        const menuYPosition = player.transform.y + 1;
        getRef().transform.setX(menuXPosition);
        getRef().transform.setY(menuYPosition);
        // Dado el ref... creo sus posibles opciones

        const optionsWithType = ['Cancelar', 'Moverse', 'Atacar', 'Defenderse'].map(
            (name, idx) => {
                return {
                    name,
                    position: {
                        x: menuXPosition,
                        y: menuYPosition + idx - 1,
                    },
                };
            }
        );

        console.log(optionsWithType);

        setDisplayMenu(true);
        setOptions(optionsWithType);

        playSfx(); // -0.6 + idx * 0.7
    });

    const pointer = usePointer();

    usePointerClick(async event => {
        if (event.button === 0) {
            // Si clickea otro lugar
            // console.log(`Menu: ${transform.x}, ${transform.y}`);
            // console.log(`Pointer: ${pointer.x}, ${pointer.y}`);

            const maybeOption = options.filter(
                o => o.position.x === pointer.x && o.position.y === pointer.y
            );

            if (maybeOption.length > 0) {
                console.log(maybeOption[0].name);
                setOptionSelected(maybeOption[0].name);
            } else {
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
    const [options, setOptions] = useState<Option[]>([]);
    const [displayMenu, setDisplayMenu] = useState(false);

    const handleOptionSelect = (option: string) => {
        setOptionSelected(option);
    };
    // {displayMenu && <Sprite {...spriteData.menu} scale={5} opacity={1} basic />}

    return (
        <GameObject name={name} persisted {...props} layer="ui">
            <Interactable />
            <MenuScript
                setDisplayMenu={setDisplayMenu}
                setOptions={setOptions}
                setOptionSelected={setOptionSelected}
                options={options}
            />
            {displayMenu && (
                <>
                    {options.map((option, idx) => (
                        <group key={idx}>
                            <MenuOption
                                text={option.name}
                                position={[0, idx - 1, 10]}
                                isSelected={optionSelected === option.name}
                                onSelect={() => handleOptionSelect(option.name)}
                            />
                        </group>
                    ))}
                </>
            )}
        </GameObject>
    );
}
