import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { MapController } from '../Data/MapController';
import { CELLS_X, CELLS_Y } from '../Data/Generics';
import { KeyBindings } from '../Data/KeyBindings';
import { Scene } from 'phaser';
import { SnakeScene } from './SnakeScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Hub',
};

export const SnakeDelayMs: number = 75; // Snake speed

export class HubScene extends Phaser.Scene {
    width: number;
    height: number;

    gameScene!: Scene;

    constructor() {
        super(sceneConfig);
        this.width = SW;
        this.height = SH + 50;

    }

    public preload() {
    }

    public create() {

        this.gameScene = this.game.scene.add('GameScene', SnakeScene, false, { x: 0, y: 200 })
    }

    public update() {
    }

    // Control over MapController's updates
    private onTimedUpdate() {
    }



}
