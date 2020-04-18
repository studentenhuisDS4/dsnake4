import * as Phaser from 'phaser';
import { scaleFactor as SF, SW, SH } from './GameConfig';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class SnakeMainScene extends Phaser.Scene {
    // private square!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    // private square2!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    private width: number;
    private height: number;

    constructor() {
        super(sceneConfig);
        this.width = SW;
        this.height = SH;
    }

    public create() {
        const grid = this.add.grid(this.width *0.6/ 2, this.height / 2, this.width + 1, this.height + 1, this.width*0.6/80, this.height/60, 0x000000, 1, 0x333333);
        console.log(this.width, this.width/24*80, this.height/24)

        let defaultTextStyle = {
            fontSize: 24,
            fontStyle: 'bold',
            fontFamily: 'Consolas',
        };
        const delta = 15;
        this.add.text(delta*4, 50, "D", defaultTextStyle);
        this.add.text(delta*3, 50, "S", defaultTextStyle);
        this.add.text(delta*2, 50, "S", defaultTextStyle);
        this.add.text(delta*1, 50, "4", defaultTextStyle);
        console.log("SNAKE SCENE - started");
    }

    public update() {
        // Called every update
        // TODO fill with game updates
    }
}