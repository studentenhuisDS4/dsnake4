import * as Phaser from 'phaser';
import { Snake, BodyPart } from '../Data/Snake';
import { JustDown } from '../imports';
import { KeyBindings } from '../Data/KeyBindings';
import { SH, SW } from '../GameConfig';
import { Button } from '@/components/GameObjects/Button';
import { GameObjects } from 'phaser';
import { MenuItem } from '@/components/GameObjects/MenuDefinition';
import { defaultTextStyle, Vector2 } from '../Data/Generics';
import { UnitTestScene } from './TestScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MenuScene extends Phaser.Scene {
    width: number;
    height: number;

    // Snake game loop
    inputKeys!: KeyBindings;
    snakes: Snake[] = [];
    cellWidth: number = 10;
    cellHeight: number = 10;

    backgroundMusic!: Phaser.Sound.BaseSound

    constructor() {
        super(sceneConfig);
        this.width = SW;
        this.height = SH;
    }

    preload() {
        this.load.image('logo', ['img/assets/menu.png', 'img/assets/menu_n.png']);
        this.load.audio('background', '/audio/DSnake4_mixdown.mp3');
    }

    public create() {
        this.createLogo('logo');
        const offset = 60;
        this.createMenu(this.width / 2, this.height / 2 + offset + 60, 30, [
            {
                text: "PLAY GAME",
                onClick: () => {
                    console.log("Changing scene to GAME");

                    // Fade-out camera
                    this.cameras.main.fade(400, 0, 0, 0);
                    this.scene.transition({
                        target: "Hub",
                        duration: 500,
                        allowInput: false,
                    });
                    this.backgroundMusic.pause();
                }
            },
            {
                text: "HIGHSCORES",
            },
            {
                text: "DEBUG // TEST",
                onClick: () => {
                    this.game.scene.start(UnitTestScene);
                }
            },
            {
                text: "HELP",
            }
        ]);
        this.createTitle(this.width / 2, this.height * 1 / 2 + offset + 30, "--- MENU ---");
        this.createSnakes();
        this.renderSnakes();

        this.inputKeys = this.input.keyboard.addKeys('W,UP,S,DOWN') as KeyBindings;
        this.time.addEvent({
            delay: 50, callback: () => {
                this.snakes.forEach(snake => {
                    snake?.moveSnake();
                    this.limitSnake(snake);
                });
                this.renderSnakes();

            }, callbackScope: this, loop: true
        });
        this.backgroundMusic = this.sound.add('background');
        this.backgroundMusic.play({ volume: 1, loop: true });
    }

    createLogo(imageName: string) {
        const x = this.width / 2;
        const y = this.height / 4 + 40;

        this.add.circle(x, y - 15, 35, 0x999999, 1);
        this.add.circle(x + 15, y - 25, 30, 0x000000, 1);
        this.add
            .image(x, y, imageName)
            .setOrigin(0.5, 0.5)
            .setAlpha(0.7)
            .setScale(0.4, 0.4)
            .setPipeline('Light2D');

        this.lights.enable();

        const snakeLights: GameObjects.Light[] = [];
        // 0x42b983 color of the light before
        for (let i = 0; i < 6; i++) {
            snakeLights[i] = this.lights.addLight(x, y, 400, 0x42b983, 1);
        }
        this.lights.setAmbientColor(0x313339);
        const moonLight: GameObjects.Light = this.lights.addLight(x, y, 200, 0xffffff, 1);

        // The mouse is fun, but the moon is calling us more. Agreed -Andrea
        // this.input.on('pointermove', function (event: MouseEvent) {
        //     light.x = event.x;
        //     light.y = event.y;
        // });

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

    createSnakes() {
        const len = 20
        this.snakes.push(new Snake(new Vector2(Math.floor(Math.random() * 70) + 20, Math.floor(Math.random() * 40) + 10), len, 'Right'));
        this.snakes.push(new Snake(new Vector2(Math.floor(Math.random() * 70) + 20, Math.floor(Math.random() * 40) + 10), len, 'Down'));
        this.snakes.push(new Snake(new Vector2(Math.floor(Math.random() * 70) + 20, Math.floor(Math.random() * 40) + 10), len, 'Down'));
        this.snakes.push(new Snake(new Vector2(Math.floor(Math.random() * 70) + 20, Math.floor(Math.random() * 40) + 10), len, 'Down'));
        this.snakes.push(new Snake(new Vector2(Math.floor(Math.random() * 70) + 20, Math.floor(Math.random() * 40) + 10), len, 'Right'));
        this.snakes.push(new Snake(new Vector2(Math.floor(Math.random() * 70) + 20, Math.floor(Math.random() * 40) + 10), len, 'Right'));
    }

    private limitSnake(snake: Snake) {
        const DISTANCE_MIN_X = 30 - Math.random() * 5;
        const DISTANCE_MAX_X = 75 + Math.random() * 5;
        const DISTANCE_MIN_Y = 0 + Math.random() * 5;
        const DISTANCE_MAX_Y = 55 + Math.random() * 5;
        switch (snake.direction) {
            case 'Left':
                if (snake.x < DISTANCE_MIN_X) {
                    snake.direction = 'Down';
                }
                break;
            case 'Right':
                if (snake.x > DISTANCE_MAX_X) {
                    snake.direction = 'Up';
                }
                break;
            case 'Up':
                if (snake.y < DISTANCE_MIN_Y) {
                    snake.direction = 'Left';
                }
                break;
            case 'Down':
                if (snake.y > DISTANCE_MAX_Y) {
                    snake.direction = 'Right';
                }
                break;
        }
    }

    update() {
        if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
            return;
        } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
            return;
        }
    }

    private renderSnakes() {
        this.snakes.forEach(snake => {
            if (snake?.bodyParts != null) {
                snake.bodyParts.forEach(part => {
                    this.renderSnakePart(part);
                });
            }
        });
        this.events.emit('snakeMovement', this.snakes);
    }

    private renderSnakePart(part: BodyPart) {
        const pixelX = (part.x - 1) * this.cellWidth + 1;
        const pixelY = (part.y - 1) * this.cellHeight - 2;
        if (part.gameObject == null) {
            part.gameObject = this.add.text(pixelX, pixelY, part.toCharacter(), defaultTextStyle);
        }
        else {
            part.gameObject.text = part.toCharacter();
            part.gameObject.setPosition(pixelX, pixelY);
        }
    }
}
