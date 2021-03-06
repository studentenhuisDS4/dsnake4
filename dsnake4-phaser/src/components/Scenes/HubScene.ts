import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { defaultTextStyle } from '../Data/Common';
import { Scene } from 'phaser';
import { SnakeScene } from './SnakeScene';
import { PauseScene as PauseTFScene } from './PauseScene';
import { SceneEvents } from './Events';
import { Vector2, Transform } from '../Generics';
import { Button } from '../GameObjects/Button';

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
    menuLink!: Phaser.GameObjects.Text;

    constructor() {
        super(sceneConfig);

        this.width = SW;
        this.height = SH;

        const verticalOffset = new Vector2(0, 50);
        const childTransform = new Transform(verticalOffset, this.width, this.height);
        this.gameScene = new SnakeScene(childTransform);
        this.pauseScene = new PauseTFScene(childTransform);
    }

    public preload() {
        this.nicknameText = this.add.text(10, 20, 'Nickname Here', defaultTextStyle);
        this.pointsText = this.add.text(10 + this.nicknameText.width + 20, 20, '0', defaultTextStyle);
        this.menuLink = this.add
            .text(this.width - 20, 20, 'MENU', defaultTextStyle)
            .setOrigin(1, 0);

        const button = Button.create(this, this.width - 20, 20, 'MENU', defaultTextStyle).setOrigin(1, 0);
        this.add.existing(button);
        button.on('pointerup', () => {
            this.game.events.emit(SceneEvents.GamePauseEvent);
        });
    }

    public create() {
        this.gameSceneObject = this.game.scene.add('GameScene', this.gameScene, false);
        this.pauseSceneObject = this.game.scene.add('PauseScene', this.pauseScene, false);

        this.time.addEvent({ callback: this.onTimedUpdate, callbackScope: this, loop: true });

        this.game.events
            .addListener(SceneEvents.GameRestartEvent, () => {
                if (this.gameSceneObject.scene.isActive() == false) {
                    console.log('Resuming. Continuing game.');
                    this.gameSceneObject.scene.restart();
                    this.pauseScene.scene.stop();
                } else {
                    throw Error("Cannot pause an already paused scene");
                }
            })
            .addListener(SceneEvents.GameContinuedEvent, () => {
                if (this.gameSceneObject.scene.isActive() == false) {
                    console.log('Resuming. Continuing game.');
                    this.pauseSceneObject.scene.stop();
                    this.gameSceneObject.scene.resume();
                } else {
                    throw Error("Cannot pause an already paused scene");
                }
            })
            .addListener(SceneEvents.GamePauseEvent, () => {
                if (this.gameSceneObject.scene.isActive()) {
                    console.log('Pause called. Pausing game.');
                    this.gameSceneObject.scene.pause();
                    this.pauseSceneObject.scene.start();
                } else {
                    throw Error("Cannot pause an already paused scene");
                }
            });
    }

    // Control over MapController's updates
    private onTimedUpdate() {
        if (this.gameScene instanceof SnakeScene) {
            this.pointsText.text = this.gameScene.getScore().toString();
        }
    }
}
