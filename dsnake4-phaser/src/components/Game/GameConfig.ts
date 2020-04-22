import * as Phaser from 'phaser';
import { SnakeMainScene } from './Scenes/SnakeMainScene';

export const scaleFactor = 1;
export const ZOOM = 1;
export const SW = 1050 * scaleFactor / ZOOM;
export const SH = 600 * scaleFactor / ZOOM;
const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,
    scene: SnakeMainScene,
    width: SW,
    height: SH,
    fps: {
        target: 25,
        forceSetTimeOut: true
    },
    // scale: {
    //     zoom: ZOOM
    // },
    // resolution: window.devicePixelRatio,
    render: {
        antialiasGL: true,
        antialias: true,
        //     roundPixels: false,
    },
    physics: {
        default: 'arcade',
        arcade: {
            fps: 15
            //     debug: true,
        },
    },
    backgroundColor: '#000000',
    parent: undefined
};

function launchGame(containerId: string) {
    gameConfig.parent = containerId;
    return new Phaser.Game(gameConfig);
}

export default launchGame
export { launchGame }
