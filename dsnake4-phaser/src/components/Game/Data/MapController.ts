import { MapVector, MapCell, Food } from './Map/MapElements';
import { Scene } from 'phaser';
import { BodyPart, Snake } from './Snake';
import { KeyBindings } from './KeyBindings';
import { JustDown } from '../imports';
import { Map } from './Map/Map';
import { defaultTextStyle } from './Generics';

export class MapController {
    private scene: Scene;
    private map: Map;
    private snake: Snake;

    cellHeight: number;
    cellWidth: number;
    inputKeys!: KeyBindings;

    constructor(scene: Scene, cellWidth: number, cellHeight: number) {
        this.scene = scene;

        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.map = new Map('FirstFloor');
        this.snake = new Snake(3, 16, 15, 'Right');

        console.log("MapController constructed with cell size", this.cellHeight, this.cellWidth);
    }

    public loadLevel() {
        this.scene.load.json
    }

    public renderCurrentMap() {
        console.log("Controller setup");
        this.inputKeys = this.scene.input.keyboard.addKeys('W,UP,S,DOWN,A,LEFT,D,RIGHT') as KeyBindings;

        this.constructMap();
        this.renderMapCells();
        this.renderSnake();
    }

    public onSceneUpdate() {
        if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
            this.snake.rotateUp();
        } else if (JustDown(this.inputKeys.A) || JustDown(this.inputKeys.LEFT)) {
            this.snake.rotateLeft();
        } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
            this.snake.rotateDown();
        } else if (JustDown(this.inputKeys.D) || JustDown(this.inputKeys.RIGHT)) {
            this.snake.rotateRight();
        }
    }

    public checkSnakeCollision() {
        return this.map.checkCollision(this.snake.x, this.snake.y) == 'Wall';
    }

    public timedUpdate() {
        this.snake.moveSnake();
        this.renderSnake();
    }

    private constructMap() {
        // Load elements into the map
        this.map
            .appendElement(new Food(new MapCell(2, 2, 'Pickup'), 'Beer', 2, 2))
            .appendElement(new Food(new MapCell(11, 11, 'Pickup'), 'Weed', 1, 1))
            .appendElement(new Food(new MapCell(41, 41, 'Pickup'), 'Krant', 1, 1))
            .appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 105, 'Right'))
            .appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 60, 'Down'))
            .appendElement(new MapVector(new MapCell(1, 60, 'Wall'), 105, 'Right'))
            .appendElement(new MapVector(new MapCell(105, 1, 'Wall'), 60, 'Down'));

        // Perform processing to 2D-array
        this.map.flattenMap();
    }

    private checkSnakeEating() {
        if (this.map.checkCollision(this.snake.x, this.snake.y) == 'Pickup') {
            return;
        }
    }

    private renderMapCells() {
        this.map.Map2D
            .forEach(row => row
                .forEach(cell => {
                    switch (cell.type) {
                        case 'Wall':
                            this.scene.add.rectangle(
                                cell.x * this.cellWidth - this.cellWidth / 2,
                                cell.y * this.cellHeight - this.cellHeight / 2,
                                this.cellWidth - 2, this.cellHeight - 2,
                                0xEEEEEE);
                            break;
                        case 'Pickup':
                            this.scene.add.rectangle(
                                cell.x * this.cellWidth - this.cellWidth / 2,
                                cell.y * this.cellHeight - this.cellHeight / 2,
                                this.cellWidth - 2, this.cellHeight - 2,
                                0xEE0000);
                    }
                }));
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
            part.gameObject = this.scene.add.text(pixelX, pixelY, part.toCharacter(), defaultTextStyle);
        }
        else {
            part.gameObject.setPosition(pixelX, pixelY);
        }
    }
}