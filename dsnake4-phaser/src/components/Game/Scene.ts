const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private square2!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    constructor() {
        super(sceneConfig);
    }

    public create() {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xDDDDDD) as any;
        // this.square2 = this.add.rectangle(400, 600, 100, 100, 0xDDDDDD) as any;
        this.physics.add.existing(this.square);
        console.log("SNAKE SCENE - started");
    }

    public update() {
        // TODO
        setInterval(() => {
            console.log("SNAKE SCENE - started");
        }, 300);
    }
}