import { MapVector, MapCell, Food } from './Map/MapElements';
import { Scene } from 'phaser';
import { BodyPart, Snake } from './Snake';
import { KeyBindings } from './KeyBindings';
import { JustDown } from '../imports';
import { Map } from './Map/Map';
import { defaultTextStyle, MapLevel as Level, CellType, Vector2 } from './Generics';

export class MapController {
    private scene: Scene;
    private map: Map;
    private snake: Snake;

    cellHeight: number;
    cellWidth: number;
    shiftX: number;
    shiftY: number;
    inputKeys!: KeyBindings;

    renderedCells!: Phaser.GameObjects.Rectangle[][];

    points: number;

    constructor(scene: Scene, cellWidth: number, cellHeight: number, shiftX: number, shiftY: number) {
        this.scene = scene;

        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.map = new Map(Level.FirstFloor);
        this.snake = new Snake(new Vector2(15, 16), 3, 'Right');

        console.log("MapController constructed with cell size", this.cellHeight, this.cellWidth);
        console.log("Shifted by: ", this.shiftX, this.shiftY);

        this.points = 0;
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
        if (this.checkSnakeEating()) {
            this.updateRenderedMap();
        }

    }

    public checkSnakeCollision() {
        return this.map.checkCollision(this.snake.x, this.snake.y) == CellType.Wall;
    }

    private checkSnakeEating(): boolean {
        if (this.map.checkCollision(this.snake.x, this.snake.y) == CellType.Pickup) {
            let vars: number[] | undefined = this.map.EatFood(this.snake.x, this.snake.y);
            if (vars != undefined) {
                this.snake.addUndigestedFood(vars[1]);
                this.points += vars[0];
                // Will perform actions based on the food eaten
                return true;
            }
        }
        return false;
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
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, CellType.Wall), 3, 'Up'))
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, CellType.Wall), 3, 'Down'))
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, CellType.Wall), 3, 'Left'))
            .appendElement(new MapVector(new MapCell(offsetX, offsetY, CellType.Wall), 3, 'Right'))
            .appendElement(new Food(new MapCell(2, 2, CellType.Pickup, 0xFFFF00), 'Beer', 2, 2))
            .appendElement(new Food(new MapCell(11, 11, CellType.Pickup, 0x00EE00), 'Weed', 1, 1))
            .appendElement(new Food(new MapCell(41, 41, CellType.Pickup, 0x8D9293), 'Krant', 1, 1))
            .appendElement(new MapVector(new MapCell(1, 1, CellType.Wall), 105, 'Right'))
            .appendElement(new MapVector(new MapCell(1, 1, CellType.Wall), 60, 'Down'))
            .appendElement(new MapVector(new MapCell(1, 60, CellType.Wall), 105, 'Right'))
            .appendElement(new MapVector(new MapCell(105, 1, CellType.Wall), 60, 'Down'));

        // Perform processing to 2D-array
        this.map.flattenMap();
    }


    private renderMapCells() {
        this.renderedCells = [];
        this.map.Map2D
            .forEach(row => row
                .forEach(cell => {
                    if (this.renderedCells[cell.x] == null) {
                        this.renderedCells[cell.x] = [];
                    }
                    this.renderedCells[cell.x][cell.y] = this.scene.add.rectangle(
                        cell.x * this.cellWidth - this.cellWidth / 2 + this.shiftX,
                        cell.y * this.cellHeight - this.cellHeight / 2 + this.shiftY,
                        this.cellWidth - 2, this.cellHeight - 2,
                        cell.color);
                }));
    }

    private updateRenderedMap() {
        this.map.Map2D
            .forEach(row => row
                .forEach(cell => {
                    if (this.renderedCells[cell.x] == null) {
                        this.renderedCells[cell.x] = [];
                    }
                    this.renderedCells[cell.x][cell.y].setFillStyle(cell.color);
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
        const pixelX = (part.x - 1) * this.cellWidth + 1 + this.shiftX;
        const pixelY = (part.y - 1) * this.cellHeight - 2 + this.shiftY;
        if (part.gameObject == null) {
            part.gameObject = this.scene.add.text(pixelX, pixelY, part.toCharacter(), defaultTextStyle);
        }
        else {
            part.gameObject.text = part.toCharacter();
            part.gameObject.setPosition(pixelX, pixelY);
        }
    }
}