import * as Phaser from 'phaser';
import { Snake, BodyPart } from '../Data/Snake';
import { JustDown } from '../imports';
import { KeyBindings } from '../Data/KeyBindings';
import { SH, SW } from '../GameConfig';
import { Button } from '@/components/GameObjects/Button';
import { GameObjects } from 'phaser';
import { MenuItem } from '@/components/GameObjects/MenuDefinition';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MenuScene extends Phaser.Scene {
    private defaultTextStyle = {
        fontSize: 20,
        fontStyle: 'normal',
        // fontFamily: 'Consolas',
        color: "#42b983",
        backgroundColor: 'rgba(0,0,0,0)'
    };

    width: number;
    height: number;

    // Snake game loop
    inputKeys!: KeyBindings;
    snakes: Snake[] = [];
    cellWidth: number = 10;
    cellHeight: number = 10;

    constructor() {
        super(sceneConfig);

        this.width = SW;
        this.height = SH;
    }

    preload() {
        this.load.setPath('img/assets/');
        // this.load.image('logo', 'logo.png');
        this.load.image('logo', 'menu_logo.png');
    }

    public create() {
        console.log("MENU SCENE - created");

        this.createLogo('logo');
        const offset = 60;
        this.createMenu(this.width / 2, this.height / 2 + offset + 60, 30, [
            {
                text: "PLAY GAME",
                onClick: () => {
                    console.log("Changing scene to GAME");

                    // Fade-out camera
                    this.cameras.main.fade(400,0,0,0);
                    this.scene.transition({
                        target: "Game",
                        duration: 500,
                        allowInput: false,
                    })
                }
            },
            {
                text: "HIGHSCORES",
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
                    snake.moveSnake();
                    this.limitSnake(snake);
                });
                this.renderSnakes();

            }, callbackScope: this, loop: true
        });
    }

    createLogo(imageName: string) {
        // Lights not working
        // this.lights.enable();
        // this.lights.addLight(300, 300, 300, 0xff0000, 1);
        // this.lights.addLight(400, 300, 300, 0x00ff00, 1);
        // this.lights.addLight(this.width / 2, this.height / 4 + 60, 300, 0x0000ff, 1);

        this.add
            .image(this.width / 2, this.height / 4 + 60, imageName)
            .setScale(0.08, 0.08);
        //.setPipeline('Light2D');
    }

    createTitle(x: number, y: number, text: string) {
        this.add
            .text(x, y, text, this.defaultTextStyle)
            .setOrigin(0.5);
    }

    createMenu(x: number, y: number, verticalSpace: number, items: MenuItem[]) {
        try {
            let spacing = 0;
            let objects: GameObjects.GameObject[] = [];
            items.forEach(item => {
                const button = Button.create(this, x, y + spacing, item.text, this.defaultTextStyle);
                objects.push(this.add.existing(button));
                button.on('pointerup', () => {
                    if (item.onClick != null) {
                        item.onClick();
                    } else {
                        console.log("Warning: button has no callback");
                    }
                })
                spacing += verticalSpace;
            });
            return objects;
        } catch (e) {
            console.log("Could not create menu due to exception: ", e);
        }
    }

    createSnakes() {
        const x = 35;
        this.snakes.push(new Snake(x, 16, 3, 'Right'));
        this.snakes.push(new Snake(x, 36, 3, 'Down'));
        this.snakes.push(new Snake(x, 36, 3, 'Down'));
        this.snakes.push(new Snake(x, 36, 3, 'Down'));
        this.snakes.push(new Snake(x, 16, 3, 'Right'));
        this.snakes.push(new Snake(x, 16, 3, 'Right'));
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
        })
    }

    private renderSnakePart(part: BodyPart) {
        const pixelX = (part.x - 1) * this.cellWidth + 1;
        const pixelY = (part.y - 1) * this.cellHeight - 2;
        if (part.gameObject == null) {
            part.gameObject = this.add.text(pixelX, pixelY, part.toCharacter(), this.defaultTextStyle);
        }
        else {
            part.gameObject.setPosition(pixelX, pixelY);
        }
    }
}
