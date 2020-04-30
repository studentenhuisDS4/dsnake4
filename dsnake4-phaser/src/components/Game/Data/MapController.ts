import { MapVector, MapCell, Food, Stair } from './Map/MapElements';
import { Scene } from 'phaser';
import { BodyPart, Snake } from './Snake';
import { KeyBindings } from './KeyBindings';
import { JustDown } from '../imports';
import { Map } from './Map/Map';
import { snakeTextStyle, defaultTextStyle, MapLevel as Level, CellType, Vector2, MapLevel} from './Generics';
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

    points: number;

    renderedCells!: Phaser.GameObjects.Rectangle[][];

    /**
     * Creates an instance of map controller.
     * Note: preloading JSON level is the responsibility of the Scene (take a look at MapLoader)
     * @param scene 
     * @param cellWidth 
     * @param cellHeight 
     */
    constructor(scene: Scene, cellWidth: number, cellHeight: number, shift: Vector2) {
        this.scene = scene;

        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.map = new Map({} as ILevel);
        this.snake = new Snake(new Vector2(15, 16), 3, 'Right');
        this.points = 0;

        this.shiftX = shift.x;
        this.shiftY = shift.y;

        console.log("MapController constructed with cell size", this.cellHeight, this.cellWidth);
        console.log("Shifted by: ", this.shiftX, this.shiftY);
    }

    public renderCurrentMap() {
        this.inputKeys = this.scene.input.keyboard.addKeys('W,UP,S,DOWN,A,LEFT,D,RIGHT') as KeyBindings;
        // this.loadLevelMap();

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
                // this.points += vars[0];
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

    public loadLevelMap(map: Map) {
        this.map = map;
        this.map.flattenMap();

        // Load elements into the map
        this.map.addRandomFood('Beer', 2, 2);
        this.map.addRandomFood('MainObject', 2, 2);
        this.map.addRandomFood('Weed', 2, 2);
        this.map.addRandomFood('Krant', 2, 2);
        this.map.addRandomFood('Coffie', 2, 2);

        this.map.flattenMap();
    }

    public reset() {
        this.snake.reset();
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