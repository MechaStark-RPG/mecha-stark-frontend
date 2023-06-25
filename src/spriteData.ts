import { SpriteProps } from './@core/Sprite';

const spriteData: { [index: string]: SpriteProps } = {
    bluePhoto: {
        src: './assets/blue_photo.png',
        frameWidth: 323,
        frameHeight: 326,
        sheet: {
            default: [[0, 0]],
        },
    },
    yellowPhoto: {
        src: './assets/yellow_photo.png',
        frameWidth: 110,
        frameHeight: 107,
        sheet: {
            default: [[0, 0]],
        },
    },
    dustTrail: {
        src: './assets/dust_trail.png',
        frameWidth: 855,
        frameHeight: 500,
        frameTime: 100,
        opacity: 0.8,
        sheet: {
            default: [
                [0, 0],
                [2, 0],
                [1, 0],
            ],
        },
    },
    shot: {
        src: './assets/shot.png',
        frameWidth: 100,
        frameHeight: 50,
        sheet: {
            fire: [[0, 0]],
            ammo: [[1, 0]],
        },
    },
    vixenMap: {
        src: './assets/map.png',
        frameWidth: 2520,
        frameHeight: 1259,
        sheet: {
            default: [[0, 0]],
        },
    },
    blackScreen: {
        src: './assets/blackscreen.png',
        frameWidth: 1024,
        frameHeight: 768,
        sheet: {
            default: [[0, 0]],
        },
    },
    attackSceneSky: {
        src: './assets/sky.png',
        frameWidth: 8000,
        frameHeight: 1000,
        sheet: {
            default: [[0, 0]],
        },
    },
    attackSceneGround: {
        src: './assets/battlefield_with_pines.png',
        frameWidth: 8000,
        frameHeight: 700,
        sheet: {
            default: [[0, 0]],
        },
    },
    explotion: {
        src: './assets/explotion.png',
        frameWidth: 190,
        frameHeight: 190,
        frameTime: 150,
        sheet: {
            default: [
                [3, 1],
                [4, 1],
                [1, 0],
                [0, 0],
            ],
        },
    },
    yellow: {
        src: './assets/yellow.png',
        frameWidth: 225,
        frameHeight: 240,
        frameTime: 120,
        sheet: {
            default: [[0, 2]],
            idle: [[0, 2]],
            idleWeapon: [[0, 0]],
            meele: [
                [1, 2],
                [3, 2],
                [2, 2],
            ],
            range: [[1, 0]],
            range1: [[2, 0]],
            defense: [
                [1, 1],
                [2, 1],
                [3, 1],
            ],
            defense1: [[2, 1]],
        },
    },
    blue: {
        src: './assets/blue.png',
        frameWidth: 225,
        frameHeight: 240,
        frameTime: 140,
        sheet: {
            default: [[0, 2]],
            idle: [[0, 2]],
            idleWeapon: [[0, 1]],
            meele: [
                [0, 0],
                [2, 0],
                [1, 0],
            ],
            range: [[1, 1]],
            range1: [[2, 1]],
            defense: [
                [1, 2],
                [2, 2],
            ],
            defense1: [[2, 2]],
        },
    },
    yellowMap: {
        src: './assets/yellow_map.png',
        frameWidth: 70,
        frameHeight: 80,
        sheet: {
            default: [[0, 0]],
        },
    },
    enemyMap: {
        src: './assets/enemy_map.png',
        frameWidth: 68,
        frameHeight: 80,
        sheet: {
            default: [[1, 0]],
        },
    },
    mechaShadow: {
        src: './assets/shadow.png',
        frameWidth: 295,
        frameHeight: 77,
        opacity: 0.3,
        sheet: {
            default: [[0, 0]],
        },
    },
    mechaEnemy: {
        src: './assets/enemy_idle.png',
        frameWidth: 254,
        frameHeight: 257,
    },
    attackPanel: {
        src: './assets/attack_panel.png',
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
};

export default spriteData;
