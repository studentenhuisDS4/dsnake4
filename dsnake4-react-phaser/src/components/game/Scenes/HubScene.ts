import * as Phaser from 'phaser';
import { defaultTextStyle, CELLS_X, CELLS_Y } from '../Data/Common';
import { SceneEvents } from '../Events';
import { Vector2, Transform } from '../Generics';
import { SceneMap, SnakeScene, PauseScene } from './';
import { BaseScene, Button } from '../GameObjects';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false
};
export class HubScene extends BaseScene {
    defaultSceneData: any;
    nicknameText!: Phaser.GameObjects.Text;
    pointsText!: Phaser.GameObjects.Text;
    menuLink!: Phaser.GameObjects.Text;

    verticalOffset = new Vector2(0, 50);
    childTransform!: Transform;

    gameScene!: SnakeScene;
    pauseMenuScene!: PauseScene;

    constructor() {
        super(sceneConfig);
    }

    public init() {
        this.childTransform = new Transform(this.verticalOffset, this.scale.width, this.scale.width / (CELLS_X / CELLS_Y));
        this.defaultSceneData = {
            transform: this.childTransform
        };
        this.gameScene = this.getScene(SceneMap.GAME.name) as SnakeScene;
        this.pauseMenuScene = this.getScene(SceneMap.PAUSE.name) as PauseScene;
    }

    public preload() {
        this.nicknameText = this.add.text(10, 20, 'Nickname Here', defaultTextStyle);
        this.pointsText = this.add.text(10 + this.nicknameText.width + 20, 20, '0', defaultTextStyle);
        this.menuLink = this.add
            .text(this.scale.width - 20, 20, 'MENU', defaultTextStyle)
            .setOrigin(1, 0);

        const button = Button.create(this, this.scale.width - 20, 20, 'MENU', defaultTextStyle).setOrigin(1, 0);
        this.add.existing(button);
        button.on('pointerup', () => {
            this.game.events.emit(SceneEvents.GamePauseEvent);
        });
    }

    public create() {
        this.gameScene.scene.start('Game', this.defaultSceneData);

        // TODO just create an event and addListener/emit it.
        this.time.addEvent({ callback: this.onTimedUpdate, callbackScope: this, loop: true });

        this.game.events
            .addListener(SceneEvents.GameRestartEvent, () => {
                if (this.gameScene.scene.isActive() == false) {
                    console.log('Resuming. Continuing game.');
                    this.gameScene.scene.restart(this.defaultSceneData);
                    this.pauseMenuScene.scene.stop();
                } else {
                    throw Error("Cannot pause an already paused scene");
                }
            })
            .addListener(SceneEvents.GameContinuedEvent, () => {
                if (this.gameScene.scene.isActive() == false) {
                    console.log('Resuming. Continuing game.');
                    this.pauseMenuScene.scene.stop();
                    this.gameScene.scene.resume();
                } else {
                    throw Error("Cannot pause an already paused scene");
                }
            })
            .addListener(SceneEvents.GamePauseEvent, () => {
                if (this.gameScene.scene.isActive()) {
                    console.log('Pause called. Pausing game.');
                    this.pauseScene(this.gameScene);
                    this.runScene(this.pauseMenuScene, this.defaultSceneData);
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
