import useComponentRegistry, { ComponentRef } from './useComponentRegistry';
import { GameObjectRef } from './GameObject';
import useGameObject from './useGameObject';
import { PubSubEvent } from './utils/createPubSub';

export type MenuTraitRef = ComponentRef<
    'MenuTrait',
    {
        displayMenu: (ref: GameObjectRef) => Promise<void>;
    }
>;

export type DisplayMenuEvent = PubSubEvent<'display-menu', GameObjectRef>;

export default function MenuTrait() {
    const { getRef, publish } = useGameObject();

    useComponentRegistry<MenuTraitRef>('MenuTrait', {
        // El menu depende del GameObjectRef
        async displayMenu(ref: GameObjectRef) {
            //Traer las opciones
            const getOptionsByRef = ['MOVE', 'ATTACK'];

            //Mostrarlas de alguna manera
            publish<DisplayMenuEvent>('display-menu', ref);
        },
    });

    return null;
}
