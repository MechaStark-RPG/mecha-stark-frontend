import { SpriteProps } from './@core/Sprite';

const spriteData: { [index: string]: SpriteProps } = {
    blackScreen: {
        src: './assets/blackscreen.png',
        frameWidth: 1024,
        frameHeight: 768,
        sheet: {
            default: [[0, 0]],
        },
    },
    attackSceneBackground1: {
        src: './assets/attack_background.png',
        frameWidth: 3500,
        frameHeight: 2333,
        sheet: {
            default: [[0, 0]],
        },
    },
    attackSceneBackground2: {
        src: './assets/attack_background.png',
        frameWidth: 3500,
        frameHeight: 2333,
        sheet: {
            default: [[1, 0]],
        },
    },
    mecha: {
        src: './assets/yellow.png',
        frameWidth: 220,
        frameHeight: 237,
        frameTime: 250,
        sheet: {
            default: [[0, 0]],
            moving: [[0, 0]],
            hitMeele: [
                [1, 0],
                [2, 0],
                [3, 0],
            ],
        },
    },
    mechaEnemy: {
        src: './assets/enemy_idle.png',
        frameWidth: 254,
        frameHeight: 257,
    },
    menuBorder: {
        src: './assets/menu_border.png',
        frameWidth: 100,
        frameHeight: 104,
        sheet: {
            topRightCorner: [[0, 0]],
            topLeftCorner: [[0, 1]],
            downLeftCorner: [[2, 1]],
            downRightCorner: [[0, 0]],
            horizontal: [[1, 0]],
            vertical: [[0, 0]],
        },
    },
    menuAttack: {
        src: './assets/attack_menu.png',
        frameWidth: 1075,
        frameHeight: 243,
        sheet: {
            default: [[0, 0]],
        },
    },
    menuBackground: {
        src: './assets/bluescreen.png',
        frameWidth: 500,
        frameHeight: 500,
        sheet: {
            default: [[0, 0]],
        },
    },
    ui: {
        src: './assets/ui.png',
        sheet: {
            'self-select': [
                [4, 0],
                [5, 0],
            ],
            select: [[4, 0]],
            dot: [[1, 0]],
            solid: [[0, 1]],
        },
    },
    player: {
        src: './assets/player.png',
        frameWidth: 20,
        frameHeight: 20,
        frameTime: 300,
        sheet: {
            default: [[0, 2]],
            walk: [
                [1, 2],
                [2, 2],
            ],
            action: [
                [0, 1],
                [2, 1],
            ],
        },
    },
    objects: {
        src: './assets/objects.png',
        frameWidth: 20,
        frameHeight: 20,
        sheet: {
            floor: [[0, 0]],
            wall: [[1, 0]],
            'workstation-1': [[0, 1]],
            'workstation-2': [[1, 1]],
            'coffee-machine': [[2, 1]],
            'coffee-machine-empty': [[3, 1]],
            pizza: [[4, 1]],
            plant: [[0, 2]],
        },
    },
    footstep: {
        src: './assets/footstep.png',
        sheet: {
            default: [
                [0, 0],
                [2, 0],
            ],
        },
        opacity: 0.75,
        frameTime: 150,
    },
};

export default spriteData;
