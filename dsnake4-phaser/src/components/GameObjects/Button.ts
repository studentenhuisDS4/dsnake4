import { GameObjects, Scene } from 'phaser';

export class Button extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, text: string | string[], style: object) {
        super(scene, x, y, text, style);

        this.setInteractive()
            .setFill('#42b983')
            .setAlpha(0.6)
            .setOrigin(0.5, 0.5)
            .on('pointerover', () => {
                this.setAlpha(1)
                    .setScale(1.05, 1.05);
            })
            .on('pointerout', () => {
                this.setAlpha(0.6)
                    .setScale(1, 1);
            });
    }

    public static create(scene: Scene, x: number, y: number, text: string, style?: object) {
        if (style == undefined) {
            style = {};
        }
        return new Button(scene, x, y, text, style);
    }
}