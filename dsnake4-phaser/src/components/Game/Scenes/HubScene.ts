import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { MapController } from '../Data/MapController';
import { CELLS_X, CELLS_Y, defaultTextStyle, Vector2 } from '../Data/Generics';
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

    gameScene!: Scene | SnakeScene;

    nicknameText!: Phaser.GameObjects.Text;
    pointsText!: Phaser.GameObjects.Text;

    constructor() {
        super(sceneConfig);
        this.width = SW;
        this.height = SH + 50;


    }

    public preload() {
        this.nicknameText = this.add.text(10, 20, 'Nickname Here', defaultTextStyle);
        this.pointsText = this.add.text(10 + this.nicknameText.width + 20, 20, '0', defaultTextStyle);
    }

    public create() {

        this.gameScene = this.game.scene.add('GameScene', new SnakeScene(new Vector2(0, 50)), false)

        this.time.addEvent({ callback: this.onTimedUpdate, callbackScope: this, loop: true });
    }

    public update() {
    }

    // Control over MapController's updates
    private onTimedUpdate() {
        if (this.gameScene instanceof SnakeScene) {
            this.pointsText.text = this.gameScene.getScore().toString();
        }
    }



}
