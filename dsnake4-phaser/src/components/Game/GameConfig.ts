import * as Phaser from 'phaser';
import { SnakeScene } from './Scenes/SnakeScene';
import { MenuScene } from './Scenes/MenuScene';
import { TestRunnerScene } from './Scenes/TestScene';

export const SW = 1050;
export const SH = 600;
const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'DSnake4',
    type: Phaser.WEBGL,
    scene: [MenuScene, SnakeScene, TestRunnerScene],
    width: SW,
    height: SH,
    fps: {
        target: 25,
        forceSetTimeOut: true
    },
    render: {
        antialiasGL: true,
        antialias: false,
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
