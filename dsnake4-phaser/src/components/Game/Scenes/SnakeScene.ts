import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { MapController } from '../Data/MapController';
import { CELLS_X, CELLS_Y, MapLevel, Vector2 } from '../Data/Generics';
import { KeyBindings } from '../Data/KeyBindings';
import { Scene } from 'phaser';
import { MapLoader } from '../Data/Map/MapLoader';

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
    private mapController: MapController;
    inputKeys!: KeyBindings;

    constructor(offset: Vector2) {
        super(sceneConfig);

        this.cellWidth = SW / CELLS_X;
        this.cellHeight = SH / CELLS_Y;

        this.shiftX = offset.x;
        this.shiftY = offset.y;

        this.mapController = new MapController(this as Scene, this.cellWidth, this.cellHeight, offset);
    }

    public preload() {
        this.load.image('logo', 'img/assets/logo.png');

        // Choose to load assets dynamically or statically
        // MapLoader.preloadLevelsDynamic(this.load, MapLevel.FirstFloor);
        MapLoader.cacheLevelsStatic(this.cache);
    }

    public create() {
        // Priority of drawing matters!

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
            let deathText = this.add.text(SW / 2, SH / 2, "You died!").setOrigin(0.5, 0.5);

            this.scene.pause();
            setTimeout(() => {
                this.mapController.reset();
                deathText.destroy();
                this.scene.resume();
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
