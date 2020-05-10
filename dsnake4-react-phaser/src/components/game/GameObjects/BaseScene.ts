import { Types } from 'phaser';

export abstract class BaseScene extends Phaser.Scene {
    constructor(sceneConfig: Types.Scenes.SettingsConfig) {
        super(sceneConfig);
    }

    protected getScene(key: Phaser.Scene | string) {
        return this.game.scene.getScene(key);
    }

    protected runScene(key: Phaser.Scene, data?: any) {
        this.scene.run(key.scene.key, data);
    }

    protected pauseScene(key: Phaser.Scene, data?: any) {
        this.scene.pause(key.scene.key, data);
    }

    protected restartScene(sceneObject: Phaser.Scene, data?: any) {
        sceneObject.scene.restart(data);
    }

    protected resumeScene(key: Phaser.Scene, data?: any) {
        this.scene.resume(key.scene.key, data);
    }
}
