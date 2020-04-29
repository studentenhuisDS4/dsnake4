import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { MapController } from '../Data/MapController';
import { CELLS_X, CELLS_Y } from '../Data/Generics';
import { KeyBindings } from '../Data/KeyBindings';
import { Scene } from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game',
};

export const SnakeDelayMs: number = 75; // Snake speed

export class SnakeScene extends Phaser.Scene {
    private cellWidth!: number;
    private cellHeight!: number;

    shiftX!: number;
    shiftY!: number;

    // Snake game loop
    private mapController!: MapController;
    inputKeys!: KeyBindings;

    constructor() {
        super(sceneConfig);

        this.cellWidth = SW / CELLS_X;
        this.cellHeight = SH / CELLS_Y;
    }

    public preload() {
        this.load.setPath('img/assets/');
        this.load.image('logo', 'logo.png');
    }

    public create(data: number[]) {
        console.log("SNAKE SCENE - created");
        console.log("Level1 data:", this.cache.json.get("Level1"));
        this.shiftX = data[0];
        this.shiftY = data[1];
        this.mapController = new MapController(this as Scene, this.cellWidth, this.cellHeight, this.shiftX, this.shiftY);

        // Priority : layering
        this.renderGrid();
        this.mapController.renderCurrentMap();

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
            this.add.text(SW / 2, SH / 2, "You died!").setOrigin(0.5, 0.5);

            this.scene.pause();
            setTimeout(() => {
                this.scene.restart();
            }, 1000);
        }
    }

    private renderGrid() {
        this.add.grid(
            SW / 2 + this.shiftX, SH / 2 + this.shiftY,
            SW + 1, SH + 1,
            this.cellWidth, this.cellHeight,
            0x000000, 0, 0x222222, 0.9);
    }

    public getScore(){
        return this.mapController.points;
    }
}
