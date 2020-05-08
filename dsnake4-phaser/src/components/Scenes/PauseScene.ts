import { Snake } from '../Data/Snake';
import { JustDown } from '../imports';
import { KeyBindings } from '../Data/KeyBindings';
import { Button } from '@/components/GameObjects/Button';
import { GameObjects, Types } from 'phaser';
import { MenuItem } from '@/components/GameObjects/MenuDefinition';
import { defaultTextStyle } from '../Data/Common';
import { SceneEvents } from './Events';
import { TransformScene } from './TransformScene';
import { Transform } from '../Generics';

const sceneConfig: Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'PauseMenu',
};

export class PauseScene extends TransformScene {
    // Snake game loop
    inputKeys!: KeyBindings;
    snakes: Snake[] = [];
    cellWidth: number = 10;
    cellHeight: number = 10;

    constructor(transform?: Transform) {
        super(sceneConfig, transform);
    }

    preload() {
        this.load.setPath('img/assets/');
        this.load.image('logo', ['menu.png', 'menu_n.png']);
    }

    public create() {
        this.applyCameraTransform();

        this.add
            .rectangle(0, 0, this.width, this.height)
            .setOrigin(0, 0)
            .setFillStyle(0x000000, 0.5);

        this.createLogo('logo');
        const offset = 60;
        this.createMenu(this.width / 2, this.height / 2 + offset + 60, 30, [
            {
                text: "CONTINUE",
                onClick: () => {
                    this.game.events.emit(SceneEvents.GameContinuedEvent);
                }
            },
            {
                text: "Main Menu",
            }
        ]);
        this.createTitle(this.width / 2, this.height * 1 / 2 + offset + 30, "--- PAUSED ---");

        this.inputKeys = this.input.keyboard.addKeys('W,UP,S,DOWN') as KeyBindings;
    }

    createLogo(imageName: string) {
        const x = this.width / 2;
        const y = this.height / 4 + 40;

        this.add
            .image(x, y, imageName)
            .setOrigin(0.5, 0.5)
            .setAlpha(0.7)
            .setScale(0.4, 0.4)
            .setPipeline('Light2D');

        this.lights.enable();

        const snakeLights: GameObjects.Light[] = [];
        for (let i = 0; i < 6; i++) {
            snakeLights[i] = this.lights.addLight(x, y, 400, 0x42b983, 1);
        }
        this.lights.setAmbientColor(0x414349);
        const moonLight: GameObjects.Light = this.lights.addLight(x, y, 200, 0xffffff, 1);

        // The mouse is fun, but the moon is calling us more. Agreed -Andrea
        this.events.on('snakeMovement', function (event: Snake[]) {
            for (let i = 0; i < 6; i++) {
                snakeLights[i].x = event[i].x * 10;
                snakeLights[i].y = event[i].y * 10;
            }
            moonLight.intensity = Math.max(Math.min(moonLight.intensity + (Math.random() * 0.05 - 0.025), 1), 0);
        });
    }

    createTitle(x: number, y: number, text: string) {
        this.add
            .text(x, y, text, defaultTextStyle)
            .setOrigin(0.5);
    }

    createMenu(x: number, y: number, verticalSpace: number, items: MenuItem[]) {
        try {
            let spacing = 0;
            let objects: GameObjects.GameObject[] = [];
            items.forEach(item => {
                const button = Button.create(this, x, y + spacing, item.text, defaultTextStyle);
                objects.push(this.add.existing(button));
                button.on('pointerup', () => {
                    if (item.onClick != null) {
                        item.onClick();
                    } else {
                        console.log("Warning: button has no callback");
                    }
                });
                spacing += verticalSpace;
            });
            return objects;
        } catch (e) {
            console.log("Could not create menu due to exception: ", e);
        }
    }

    update() {
        if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
            return;
        } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
            return;
        }
    }
}
