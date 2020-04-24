import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { MapController } from '../Data/MapController';
import { CELLS_X, CELLS_Y } from '../Data/Generics';
import { KeyBindings } from '../Data/KeyBindings';
import { Scene } from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export const SnakeDelayMs: number = 75; // Snake speed

export class SnakeScene extends Phaser.Scene {
    // TARGET: 105 by 60 cell grid

    private width: number;
    private height: number;
    private cellWidth!: number;
    private cellHeight!: number;

    private defaultTextStyle = {
        fontSize: this.cellHeight?.toString(),
        fontStyle: 'normal',
        fontFamily: 'Consolas',
        color: "#42b983",
        backgroundColor: 'rgba(0,0,0,0)'
    };

    // Snake game loop
    private mapController!: MapController;
    inputKeys!: KeyBindings;

    constructor() {
        super(sceneConfig);
        this.width = SW * 0.8;
        this.height = SH;

        this.cellWidth = this.width / CELLS_X;
        this.cellHeight = this.height / CELLS_Y;
    }

    public preload() {
        this.load.setPath('img/assets/');
        this.load.image('logo', 'logo.png');
    }

    public create() {
        console.log("SNAKE SCENE - created");
        this.mapController = new MapController(this as Scene, this.cellWidth, this.cellHeight);

        // Priority : layering
        this.renderGrid();
        this.mapController.setup();

        this.time.addEvent({ delay: SnakeDelayMs, callback: this.onTimedUpdate, callbackScope: this, loop: true });
    }

    public update() {
        // Propagate input
        this.mapController.onSceneUpdate();
    }

    // Control over MapController's updates
    private onTimedUpdate() {
        this.mapController.timedUpdate();

        if (this.mapController.checkSnakeCollision()) {
            this.add.text(this.width / 2, this.height / 2, "You died!").setOrigin(0.5, 0.5);

            this.scene.pause();
            setTimeout(() => {
                this.scene.restart();
            }, 1000);
        }
    }

    private renderGrid() {
        this.add.grid(
            this.width / 2, this.height / 2,
            this.width + 1, this.height + 1,
            this.cellWidth, this.cellHeight,
            0x000000, 0, 0x222222, 0.9);
    }


}
