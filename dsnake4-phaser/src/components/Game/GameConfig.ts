import * as Phaser from 'phaser';
import { SnakeScene } from './Scenes/SnakeScene';
import { MenuScene } from './Scenes/MenuScene';

export const ZOOM = 1;
export const SW = 1050 / ZOOM;
export const SH = 600 / ZOOM;
const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'DSnake4',
    type: Phaser.AUTO,
    scene: [MenuScene, SnakeScene],
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
