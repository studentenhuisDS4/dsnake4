import { Types } from 'phaser';
import { SW, SH } from '../GameConfig';
import { Vector2, Transform } from '../Generics';

export class TransformScene extends Phaser.Scene {
    origin: Vector2;
    width: number;
    height: number;

    constructor(sceneConfig: Types.Scenes.SettingsConfig, transform?: Transform) {
        super(sceneConfig);

        this.origin = new Vector2(0, 0);
        this.width = SW;
        this.height = SH;
        this.setTransform(transform);
    }

    public applyCameraTransform(transform?: Transform) {
        if (transform != null) {
            this.setTransform(transform);
        }
        this.cameras.main.setPosition(this.origin.x, this.origin.y);
        this.cameras.main.width = this.width;
        this.cameras.main.height = this.height;
    }

    private setTransform(newTransform?: Transform) {
        if (newTransform != null) {
            if (newTransform.origin != null) {
                this.origin = newTransform.origin;
            }
            this.width = newTransform.width;
            this.height = newTransform.height;
        }
    }
}
