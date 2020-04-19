import * as Phaser from 'phaser';
import { scaleFactor as SF, SW, SH } from './GameConfig';
import { Snake, BodyPart } from './Snake';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export const SnakeDelayMs: number = 150;

export class SnakeMainScene extends Phaser.Scene {
    // private square!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    // private square2!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    // TARGET: 105 by 60 cell grid

    private width: number;
    private height: number;
    private cellsX: number = 80;
    private cellsY: number = 60;
    private cellWidth!: number;
    private cellHeight!: number;

    private snake!: Snake;
    private defaultTextStyle = {
        fontSize: this.cellHeight?.toString(),
        fontStyle: 'normal',
        fontFamily: 'Consolas',
        color: "#42b983",
        backgroundColor: 'rgba(0,0,0,0)'
    };

    private timedEvent!: Phaser.Time.TimerEvent;

    constructor() {
        super(sceneConfig);
        this.width = SW * 0.8;
        this.height = SH;
    }

    public create() {
        console.log("SNAKE SCENE - created");

        this.cellWidth = this.width / this.cellsX;
        this.cellHeight = this.height / this.cellsY;

        this.add.grid(
            this.width / 2, this.height / 2,
            this.width + 1, this.height + 1,
            this.cellWidth, this.cellHeight,
            0x000000, 1, 0x222222, 0.9);

        this.snake = new Snake(15, 16, 3, 'Right');
        this.renderSnake();

        this.input.keyboard.on('keydown-' + 'LEFT', (event: any) => {
            event.preventDefault();
            this.snake.rotateLeft();
        });
        this.input.keyboard.on('keydown-' + 'A', (event: any) => {
            event.preventDefault();
            this.snake.rotateLeft();
        });
        this.input.keyboard.on('keydown-' + 'RIGHT', (event: any) => {
            event.preventDefault();
            this.snake.rotateRight();
        });
        this.input.keyboard.on('keydown-' + 'D', (event: any) => {
            event.preventDefault();
            this.snake.rotateRight();
        });

        this.timedEvent = this.time.addEvent({ delay: SnakeDelayMs, callback: this.onTimedUpdate, callbackScope: this, loop: true });
    }

    private onTimedUpdate() {
        this.snake.moveSnake();
        this.renderSnake();
    }

    private renderSnake() {
        if (this.snake?.bodyParts != null) {
            this.snake.bodyParts.forEach(part => {
                this.renderSnakePart(part);
            });
        }
    }

    private renderSnakePart(part: BodyPart) {
        this.snake.bodyParts.forEach(part => {
            const pixelX = (part.x - 1) * this.cellWidth;
            const pixelY = (part.y - 1) * this.cellHeight;
            if (part.gameObject == null) {
                part.gameObject = this.add.text(pixelX, pixelY, part.toCharacter(), this.defaultTextStyle);
            }
            else {
                part.gameObject.setPosition(pixelX, pixelY);
            }
        });
    }
}
