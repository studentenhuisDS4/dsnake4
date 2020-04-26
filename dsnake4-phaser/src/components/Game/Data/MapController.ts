import { MapVector, MapCell } from './Map/MapElements';
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
        this.snake = new Snake(15, 16, 3, 'Right');

        console.log("MapController constructed with cell size", this.cellHeight, this.cellWidth);
    }

    public loadLevel() {
        this.scene.load.json;
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
        const offsetX = 30;
        const offsetY = 30;

        // Load elements into the map
        this.map
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Up'))
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Down'))
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Left'))
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Right'));

        // Perform processing to 2D-array
        this.map.flattenMap();
    }

    private renderMapCells() {
        this.map.Map2D
            .forEach(row => row
                .forEach(cell => {
                    this.scene.add.rectangle(
                        cell.x * this.cellWidth - this.cellWidth / 2,
                        cell.y * this.cellHeight - this.cellHeight / 2,
                        this.cellWidth - 2, this.cellHeight - 2,
                        0xEEEEEE);
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
            part.gameObject.text = part.toCharacter();
            part.gameObject.setPosition(pixelX, pixelY);
        }
    }
}