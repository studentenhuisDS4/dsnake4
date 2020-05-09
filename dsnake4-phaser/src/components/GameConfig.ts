import * as Phaser from 'phaser';
import { SnakeScene } from './Scenes/SnakeScene';
import { MenuScene } from './Scenes/MenuScene';
import { HubScene } from './Scenes/HubScene';
import { TestRunnerScene } from './Scenes/TestScene';

export const SW = 1050;
export const SH = 600;
export const FPS: number = 40;
const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'DSnake4',
    type: Phaser.AUTO,
    scene: [MenuScene, HubScene, TestRunnerScene],
    width: SW,
    height: SH + 50,
    // fps: {
    //     target: FPS,
    //     forceSetTimeOut: true
    // },
    backgroundColor: '#000000',
    parent: undefined
};

function launchGame(containerId: string) {
    gameConfig.parent = containerId;
    return new Phaser.Game(gameConfig);
}

export default launchGame
export { launchGame }
