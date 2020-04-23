import * as Phaser from 'phaser';
import { Snake, BodyPart } from '../Data/Snake';
import { JustDown } from '../imports';
import { KeyBindings } from '../Data/KeyBindings';
import { SH, SW } from '../GameConfig';
import { CELLS_X } from '../Data/Generics';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MenuScene extends Phaser.Scene {
    private defaultTextStyle = {
        fontSize: 20,
        fontStyle: 'normal',
        fontFamily: 'Consolas',
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
    titleText!: Phaser.GameObjects.Text;
    private texts: Phaser.GameObjects.Text[] = [];

    constructor() {
        super(sceneConfig);
        this.snakes.push(new Snake(35, 16, 3, 'Right'));
        this.snakes.push(new Snake(35, 36, 3, 'Down'));
        this.snakes.push(new Snake(35, 36, 3, 'Down'));
        this.snakes.push(new Snake(35, 36, 3, 'Down'));
        this.snakes.push(new Snake(35, 16, 3, 'Right'));
        this.snakes.push(new Snake(35, 16, 3, 'Right'));

        this.width = SW;
        this.height = SH;
    }

    preload() {
        this.load.setPath('img/assets/');
        this.load.image('logo', 'logo.png');
    }

    public create() {
        console.log("MENU SCENE - created");
        this.renderSnakes();

        this.texts.push(
            this.add.text(this.width / 2 - 65, this.height / 2 - 40, "PLAY GAME").setInteractive()
        );
        this.texts.push(
            this.add.text(this.width / 2 - 55, this.height / 2, "Highscores").setInteractive()
        );
        this.texts.push(
            this.add.text(this.width / 2 - 55, this.height / 2 + 40, "Help").setInteractive()
        );

        this.titleText = this.add.text(this.width / 2, this.height * 1 / 4, "DSnak4 - main menu", this.defaultTextStyle);
        this.titleText.setOrigin(0.5);

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

    private limitSnake(snake: Snake) {
        const DISTANCE_MIN_X = 40 - Math.random() * 5;
        const DISTANCE_MAX_X = 65 + Math.random() * 5;
        const DISTANCE_MIN_Y = 5 + Math.random() * 5;
        const DISTANCE_MAX_Y = 40 + Math.random() * 5;
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
