import React from "react";
import Collider from "../@core/Collider";
import GameObject, { GameObjectProps } from "../@core/GameObject";
import Interactable from "../@core/Interactable";
import Moveable from "../@core/Moveable";
import Sprite from "../@core/Sprite";
import CharacterScript from "../components/CharacterScript";
import MechaScript from "../components/MechaScript";
import spriteData from "../spriteData";
import MechaScriptFromAction from "../components/MechaScripFromAction";
import { Mecha as MechaType } from "../@core/logic/GameState";


interface MechaProps extends GameObjectProps {
  isTurn: boolean;
  mechaId: string;
  mecha: MechaType;
}

export default function Mecha({ isTurn, mechaId, mecha, ...props }: MechaProps) {
  return (
    <GameObject name={"mecha" + mechaId} displayName="Player" layer="character" {...props}>
      <Moveable />
      <Interactable />
      <Collider />
      <CharacterScript>
        <Sprite {...spriteData.yellowMap} />
      </CharacterScript>
      {isTurn ? <MechaScript mecha={mecha} /> : <MechaScriptFromAction />}
    </GameObject>
  );
}
