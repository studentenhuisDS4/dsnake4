import * as Phaser from 'phaser';
import { GameScene } from './Scene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,
    scene: GameScene,

    scale: {
        width: window.innerWidth/2,
        height: window.innerHeight/2,
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },

    parent: 'game',
    backgroundColor: '#000000',
};

// export const snakegame = new Phaser.Game(gameConfig);

export class SnakeGame extends Phaser.Game {
    constructor(gameConfig: Phaser.Types.Core.GameConfig) {
        super(gameConfig);
    }
}