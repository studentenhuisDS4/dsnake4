const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class SnakeMainScene extends Phaser.Scene {
    private square!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private square2!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    constructor() {
        super(sceneConfig);
    }

    public create() {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xDDDDDD) as any;
        this.square2 = this.add.rectangle(60, 60, 50, 50, 0xDDDDDD) as any;
        this.physics.add.existing(this.square);
        this.physics.add.existing(this.square2);
        console.log("SNAKE SCENE - started");
    }

    public update() {
        // Called every update
        // TODO fill with game updates
    }
}