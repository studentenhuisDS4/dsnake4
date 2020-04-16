const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    constructor() {
        super(sceneConfig);
    }

    public create() {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xDDDDDD) as any;
        this.physics.add.existing(this.square);
        console.log("SNAKE SCENE - started");
    }

    public update() {
        // Called every update
        // TODO fill with game updates
    }
}