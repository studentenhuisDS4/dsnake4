import { MapVector, MapCell, Food, Stair } from './Map/MapElements';
import { Scene } from 'phaser';
import { BodyPart, Snake } from './Snake';
import { KeyBindings } from './KeyBindings';
import { JustDown } from '../imports';
import { Map } from './Map/Map';
import { defaultTextStyle, MapLevel as Level, CellType, Vector2, MapLevel } from './Generics';
import { ILevel } from './Map/JsonInterfaces';
import { Wall } from './Map/Wall';
import { MapLoader } from './Map/MapLoader';

export class MapController {
    private scene: Scene;
    private map: Map;
    private snake: Snake;

    cellHeight: number;
    cellWidth: number;
    shiftX!: number;
    shiftY!: number;
    inputKeys!: KeyBindings;

    renderedCells!: Phaser.GameObjects.Rectangle[][];

    /**
     * Creates an instance of map controller.
     * Note: preloading JSON level is the responsibility of the Scene (take a look at MapLoader)
     * @param scene 
     * @param cellWidth 
     * @param cellHeight 
     */
    constructor(scene: Scene, cellWidth: number, cellHeight: number) {
        this.scene = scene;

        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.map = new Map({} as ILevel);
        this.snake = new Snake(new Vector2(15, 16), 3, 'Right');

        console.log("MapController constructed with cell size", this.cellHeight, this.cellWidth);
        console.log("Shifted by: ", this.shiftX, this.shiftY);

        this.points = 0;
    }

    public renderCurrentMap() {
        this.inputKeys = this.scene.input.keyboard.addKeys('W,UP,S,DOWN,A,LEFT,D,RIGHT') as KeyBindings;
        this.loadLevelMap();

        this.renderMapCells();
        this.renderSnake();
    }

    public onSceneUpdate() {
        this.updateRenderedMap();
        this.renderSnake();
    }

    public checkSnakeCollision() {
        return this.map.checkCollision(this.snake.x, this.snake.y) == CellType.Wall;
    }

    private checkSnakeEating(): boolean {
        if (this.map.checkCollision(this.snake.x, this.snake.y) == CellType.Pickup) {
            let vars: number[] | undefined = this.map.eatFood(this.snake.x, this.snake.y);
            if (vars != undefined) {
                this.snake.addUndigestedFood(vars[1]);
                this.points += vars[0];
                // Will perform actions based on the food eaten
                this.map.addRandomFood();
                this.map.flattenMap();
                return true;
            }
        }
        return false;
    }

    public timedUpdate() {
        if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
            this.snake.rotateUp();
        } else if (JustDown(this.inputKeys.A) || JustDown(this.inputKeys.LEFT)) {
            this.snake.rotateLeft();
        } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
            this.snake.rotateDown();
        } else if (JustDown(this.inputKeys.D) || JustDown(this.inputKeys.RIGHT)) {
            this.snake.rotateRight();
        }
        this.snake.moveSnake();
        this.checkSnakeEating()
    }

    private loadLevelMap() {
        const offsetX = 30;
        const offsetY = 30;

        // Load elements into the map
        this.map = MapLoader.loadLevel(this.scene.cache, Level.FirstFloor)
            .appendElement(new MapVector(new MapCell(new Vector2(offsetX, offsetY), CellType.Wall), 3, 'Up'))
            .appendElement(new MapVector(new MapCell(new Vector2(offsetX, offsetY), CellType.Wall), 3, 'Down'))
            .appendElement(new MapVector(new MapCell(new Vector2(offsetX, offsetY), CellType.Wall), 3, 'Left'))
            .appendElement(new MapVector(new MapCell(new Vector2(offsetX, offsetY), CellType.Wall), 3, 'Right'))
            .appendElement(new Food(new MapCell(new Vector2(2, 2), CellType.Pickup, 0xFFFF00), 'Beer', 2, 2))
            .appendElement(new Food(new MapCell(new Vector2(11, 11), CellType.Pickup, 0x00EE00), 'Weed', 1, 1))
            .appendElement(new Food(new MapCell(new Vector2(41, 41), CellType.Pickup, 0x8D9293), 'Krant', 1, 1))
            .appendElement(new Wall(new Vector2(1, 1), 105, 'Right'))
            .appendElement(new Wall(new Vector2(1, 1), 60, 'Down'))
            .appendElement(new Wall(new Vector2(1, 60), 105, 'Right'))
            .appendElement(new Wall(new Vector2(105, 1), 60, 'Down'))
            // Perform processing to 2D-array
            .flattenMap();
    }

    public reset() {
        this,this.snake.reset();
        this.snake = new Snake(new Vector2(15, 16), 3, 'Right');
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
            part.gameObject = this.scene.add.text(pixelX, pixelY, part.toCharacter(), snakeTextStyle);
        }
        else {
            part.gameObject.text = part.toCharacter();
            part.gameObject.setPosition(pixelX, pixelY);
        }
    }
}