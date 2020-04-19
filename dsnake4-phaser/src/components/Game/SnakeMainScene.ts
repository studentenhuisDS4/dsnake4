import * as Phaser from 'phaser';
import { scaleFactor as SF, SW, SH } from './GameConfig';
import { Snake } from './Snake';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class SnakeMainScene extends Phaser.Scene {
    // private square!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    // private square2!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    // TARGET: 105 by 60 cell grid

    private width: number;
    private height: number;
    private cellsX: number = 105;
    private cellsY: number = 60;
    private cellWidth!: number;
    private cellHeight!: number;

    private snake!: Snake;

    constructor() {
        super(sceneConfig);
        this.width = SW * 0.8;
        this.height = SH;
    }

    public create() {
        this.cellWidth = this.width / this.cellsX;
        this.cellHeight = this.height / this.cellsY;
        
        this.add.grid(
            this.width / 2, this.height / 2,
            this.width + 1, this.height + 1,
            this.cellWidth, this.cellHeight,
            0x000000, 1, 0x222222, 0.9);

        // let defaultTextStyle = {
        //     fontSize: this.cellHeight,
        //     fontStyle: 'normal',
        //     fontFamily: 'Consolas',
        //     color: "#42b983"
        // };

        this.snake = new Snake(3, 3, 3, 'Up');

        // let delta = this.cellWidth;
        // let i = 1;
        // for (let j = 0; j < 12; j++) {
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "D", defaultTextStyle);
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "S", defaultTextStyle);
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "S", defaultTextStyle);
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "S", defaultTextStyle);
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "S", defaultTextStyle);
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "S", defaultTextStyle);
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "S", defaultTextStyle);
        //     this.add.text(delta * i++ + 3, (j + 3) * delta, "4", defaultTextStyle);
        // }

        console.log("SNAKE SCENE - started");
    }

    public update() {
        // Called every update
        // TODO fill with game updates
    }
}