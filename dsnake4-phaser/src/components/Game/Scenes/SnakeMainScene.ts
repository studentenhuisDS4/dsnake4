import * as Phaser from 'phaser';
import { scaleFactor as SF, SW, SH } from '../GameConfig';
import { Snake, BodyPart } from '../Data/Snake';
import { Map, MapVector, MapCell } from '../Data/Map';
import { CELLS_X, CELLS_Y } from '../Data/Generics';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

// Define speed of the snake (note GameConfig.fps.target = 25 limit)
export const SnakeDelayMs: number = 100;

export class SnakeMainScene extends Phaser.Scene {
    // TARGET: 105 by 60 cell grid

    private width: number;
    private height: number;
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

    // Snake game loop
    private timedEvent!: Phaser.Time.TimerEvent;
    private map!: Map;

    constructor() {
        super(sceneConfig);
        this.width = SW * 0.8;
        this.height = SH;
    }

    public create() {
        console.log("SNAKE SCENE - created");

        this.cellWidth = this.width / CELLS_X;
        this.cellHeight = this.height / CELLS_Y;

        this.map = new Map();
        this.map.flattenMap();
        this.constructMapElements();
        this.snake = new Snake(15, 16, 3, 'Right');

        this.renderMap(); // Perform this before rendering the snake if you want it to underlap.
        this.renderSnake();
        this.renderGrid();

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
        this.input.keyboard.on('keydown-' + 'UP', (event: any) => {
            event.preventDefault();
            this.snake.rotateUp();
        });
        this.input.keyboard.on('keydown-' + 'W', (event: any) => {
            event.preventDefault();
            this.snake.rotateUp();
        });
        this.input.keyboard.on('keydown-' + 'DOWN', (event: any) => {
            event.preventDefault();
            this.snake.rotateDown();
        });
        this.input.keyboard.on('keydown-' + 'S', (event: any) => {
            event.preventDefault();
            this.snake.rotateDown();
        });

        this.timedEvent = this.time.addEvent({ delay: SnakeDelayMs, callback: this.onTimedUpdate, callbackScope: this, loop: true });
    }

    private onTimedUpdate() {
        this.snake.moveSnake();
        this.renderSnake();
    }

    private constructMapElements() {
            this.map.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 3, 'Up'));
            this.map.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 30, 'Down'));
            this.map.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 3, 'Left'));
            this.map.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 30, 'Right'));
            this.map.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 30, 'Right'));
            this.map.appendElement(new MapVector(new MapCell(10, 1, 'Wall'), 30, 'Right'));
            this.map.appendElement(new MapVector(new MapCell(1, 30, 'Wall'), 30, 'Right'));
    
            // TODO add easy way to define rooms, f.e. MapRectangle or MapStairs:
            // this.appendElement(new MapRectangle(x1, y1, 3, 'Up'));
            // this.loadMapFromImage(imageMap);
    }

    private renderMap() {
        this.map.Map2D
            .forEach(row => row
                .forEach(cell => {
                    if (cell.x > 10) {
                    console.log(cell.x, cell.y);
                }
                    this.add.rectangle(
                        cell.x * this.cellWidth - this.cellWidth / 2,
                        cell.y * this.cellHeight - this.cellHeight / 2,
                        this.cellWidth-2, this.cellHeight-2,
                        0xEEEEEE);
                }));
    }

    private renderGrid() {
        this.add.grid(
            this.width / 2, this.height / 2,
            this.width + 1, this.height + 1,
            this.cellWidth, this.cellHeight,
            0x000000, 0, 0x222222, 0.9);
    }

    private renderSnake() {
        if (this.snake?.bodyParts != null) {
            this.snake.bodyParts.forEach(part => {
                this.renderSnakePart(part);
            });
        }
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
