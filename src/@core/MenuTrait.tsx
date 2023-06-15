import useComponentRegistry, { ComponentRef } from './useComponentRegistry';
import { GameObjectRef } from './GameObject';
import useGameObject from './useGameObject';
import { PubSubEvent } from './utils/createPubSub';
import { TriggerEvent } from './Collider';

export type MenuTraitRef = ComponentRef<
    'MenuTrait',
    {
        displayMenu: (ref: GameObjectRef) => Promise<boolean>;
    }
>;

export type DisplayMenuEvent = PubSubEvent<'display-menu', GameObjectRef>;

export default function MenuTrait() {
    const { publish } = useGameObject();

    useComponentRegistry<MenuTraitRef>('MenuTrait', {
        // El menu depende del GameObjectRef
        async displayMenu(ref: GameObjectRef) {
            console.log('MENU TRAIT');
            publish<DisplayMenuEvent>('display-menu', ref);
            publish<TriggerEvent>('trigger', ref);

            return true;
        },
    });

    return null;
}
