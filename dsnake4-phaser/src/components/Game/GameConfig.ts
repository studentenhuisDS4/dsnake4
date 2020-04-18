import * as Phaser from 'phaser';
import { SnakeMainScene } from './SnakeMainScene';

export const scaleFactor = 1.2;
export const ZOOM = 1;
export const SW = 1300 * scaleFactor / ZOOM;
export const SH = 600 * scaleFactor / ZOOM;
const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.WEBGL,
    scene: SnakeMainScene,
    width: SW,
    height: SH,
    scale: {
        zoom: ZOOM
    },
    resolution: window.devicePixelRatio,
    render: {
        antialiasGL: true,
        antialias: true,
        roundPixels: false,

    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    backgroundColor: '#DDDDDD',
    parent: undefined,
    // backgroundColor: '#000000',
};

function launchGame(containerId: string) {
    gameConfig.parent = containerId;
    return new Phaser.Game(gameConfig);
}

export default launchGame
export { launchGame }