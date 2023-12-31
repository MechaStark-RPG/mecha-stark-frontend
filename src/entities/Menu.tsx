import React, { useEffect, useState } from "react";
import GameObject, { GameObjectProps, Position } from "../@core/GameObject";
import useGameObjectEvent from "../@core/useGameObjectEvent";
import Interactable, { InteractionEvent } from "../@core/Interactable";
import usePointer from "../@core/usePointer";
import usePointerClick from "../@core/usePointerClick";
import useGameObject from "../@core/useGameObject";
import MenuOption from "./MenuOption";
import useGame from "../@core/useGame";
import GraphicOriginal from '../@core/GraphicOriginal';
import { MechaWillAttackEvent, MechaWillMoveEvent } from "../@core/logic/MechaEvent";
import spriteData from '../spriteData';

interface MenuScriptProps {
  setDisplayMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  setOptionSelected: React.Dispatch<React.SetStateAction<string>>;
  setMechaId: React.Dispatch<React.SetStateAction<string>>;
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
                      setMechaId
                    }: MenuScriptProps) {
  const { getRef, transform } = useGameObject();
  // const playSfx = useSound(soundData.eating);

    useGameObjectEvent<InteractionEvent>('interaction', mecha => {
        const menuXPosition = mecha.transform.x + 2;
        const menuYPosition = mecha.transform.y + 1;
        getRef().transform.setX(menuXPosition);
        getRef().transform.setY(menuYPosition);
        // Dado el ref... creo sus posibles opciones

        const optionsWithType = ['Cancel', 'Move', 'Attack'].map((name, idx) => {
            return {
                name,
                position: {
                    x: menuXPosition,
                    y: menuYPosition + idx - 1,
                },
            };
        });

        setDisplayMenu(true);
        setOptions(optionsWithType);
        setMechaId(mecha.name);

        // playSfx(); // -0.6 + idx * 0.7
    });

    const pointer = usePointer();

    usePointerClick(async event => {
        if (event.button === 0) {
            const maybeOption = options.filter(
                o => o.position.x === pointer.x && o.position.y === pointer.y
            );
            // Clickeo alguna de las opciones
            if (maybeOption.length > 0) {
                setOptionSelected(maybeOption[0].name);
            } else {
                // Vuelvo a las posiciones harcodeadas
                setDisplayMenu(false);
                setMechaId('');
                getRef().transform.setX(7);
                getRef().transform.setY(3);
            }
        }
    });

  return <></>;
}

// Deshabilitarlo es matarlo
export default function Menu(props: GameObjectProps) {
  const [optionSelected, setOptionSelected] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [mechaId, setMechaId] = useState("");
  const { publish } = useGame();

  useEffect(() => {
    const triggerMenuOptionSelected = async () => {
      if (optionSelected !== "" && optionSelected !== "Cancel") {
        if (optionSelected === "Move") {
          await publish<MechaWillMoveEvent>("mecha-will-move", { mechaId });
        } else if (optionSelected === "Attack") {
          await publish<MechaWillAttackEvent>("mecha-will-attack", { mechaId });
        }
        setOptionSelected("");
        setMechaId("");
        setDisplayMenu(false);
        setOptions([]);
      }
    };

    triggerMenuOptionSelected();
  }, [optionSelected]);

  const handleOptionSelect = (option: string) => {
    setOptionSelected(option);
  };
  // {displayMenu && <Sprite {...spriteData.menu} scale={5} opacity={1} basic />}

    return (
        <GameObject name="menu" persisted {...props} layer="ui">
            <Interactable />
            <MenuScript
                setDisplayMenu={setDisplayMenu}
                setOptions={setOptions}
                setOptionSelected={setOptionSelected}
                options={options}
                setMechaId={setMechaId}
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
                    <GraphicOriginal
                        {...spriteData.menuBackground}
                            offset={{ x: 0, y: 0 }}
                            customScale={{ width: 2.5, height: options.length, z: 10 }}
                            opacity={1}
                            basic
                    />
                    <GraphicOriginal
                        {...spriteData.menuNormal}
                            offset={{ x: 0, y: 0 }}
                            customScale={{ width: 2.8, height: options.length + 1, z: 10 }}
                            opacity={1}
                            basic
                    />
                </>
            )}
        </GameObject>
    );
}
