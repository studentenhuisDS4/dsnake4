import * as Phaser from 'phaser';
import { SnakeMainScene } from './SnakeMainScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,
    scene: SnakeMainScene,

    scale: {
        width: 800,
        height: 600,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },

    parent: undefined,
    backgroundColor: '#000000',
};

function launchGame(containerId: string) {
    gameConfig.parent = containerId;
    gameConfig.backgroundColor = '#DDD';
    return new Phaser.Game(gameConfig);
}

export default launchGame
export { launchGame }