import { SoundProps } from './@core/Sound';

const soundData: { [index: string]: SoundProps } = {
    eating: {
        // "Chewing" by InspectorJ - freesound.org
        src: './assets/sfx/eating.wav',
    },
    drinking: {
        // "Drinking" by dersuperanton - freesound.org"
        src: './assets/sfx/drinking.wav',
    },
    footstep: {
        src: './assets/sfx/footstep.wav',
        volume: 0.75,
    },
    vixenMusic: {
        src: './assets/sfx/01.mp3',
        volume: 0.1,
    },
    prepare: {
        src: './assets/sfx/attack_range.wav',
        volume: 0.05,
    },
    hit: {
        src: './assets/sfx/hit.wav',
        volume: 0.05,
    },
    shot: {
        src: './assets/sfx/shot.wav',
        volume: 0.05,
    },
    walk: {
        src: './assets/sfx/walk.wav',
        volume: 0.05,
    },
};

export default soundData;
