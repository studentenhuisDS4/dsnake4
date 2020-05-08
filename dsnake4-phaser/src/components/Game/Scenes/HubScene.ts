import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { defaultTextStyle } from '../Data/Common';
import { Scene } from 'phaser';
import { SnakeScene } from './SnakeScene';
import { PauseScene as PauseTFScene } from './PauseScene';
import { SceneEvents } from './Events';
import { Vector2, Transform } from '../Generics';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Hub',
};

export const SnakeDelayMs: number = 75; // Snake speed

export class HubScene extends Phaser.Scene {
    width: number;
    height: number;

    gameScene: SnakeScene;
    gameSceneObject!: Scene;
    pauseScene: PauseTFScene;
    pauseSceneObject!: Scene;

    nicknameText!: Phaser.GameObjects.Text;
    pointsText!: Phaser.GameObjects.Text;

    constructor() {
        super(sceneConfig);

        this.width = SW;
        this.height = SH + 50;

        const verticalOffset = new Vector2(0, 50);
        const childTransform = new Transform(verticalOffset, this.width, this.height);
        this.gameScene = new SnakeScene(childTransform);
        this.pauseScene = new PauseTFScene(childTransform);
    }

    public preload() {
        this.nicknameText = this.add.text(10, 20, 'Nickname Here', defaultTextStyle);
        this.pointsText = this.add.text(10 + this.nicknameText.width + 20, 20, '0', defaultTextStyle);
    }

    public create() {
        this.gameSceneObject = this.game.scene.add('GameScene', this.gameScene, false);
        this.pauseSceneObject = this.game.scene.add('PauseScene', this.pauseScene, false);

        this.time.addEvent({ callback: this.onTimedUpdate, callbackScope: this, loop: true });
        this.time.addEvent({ callback: this.pauseGame, delay: 1000, callbackScope: this, loop: false });
        
        this.game.events.addListener(SceneEvents.GameContinuedEvent, () => {
            console.log('Pause cancelled. Continuing game.');
        });
    }

    private pauseGame() {
        // this.gameScene.scene.pause();
    }

    // Control over MapController's updates
    private onTimedUpdate() {
        if (this.gameScene instanceof SnakeScene) {
            this.pointsText.text = this.gameScene.getScore().toString();
        }
    }
}
