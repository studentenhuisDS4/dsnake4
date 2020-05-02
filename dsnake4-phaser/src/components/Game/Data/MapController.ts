import { Stair } from './Map/Stair';
import { Scene } from 'phaser';
import { KeyBindings } from './KeyBindings';
import { Map } from './Map/Map';
import { MapLevel as Level, CellType, Vector2 } from './Generics';
import { ILevel } from './Map/JsonInterfaces';

export class MapController {
    private scene: Scene;
    public map: Map;
    public level: Level;

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
    constructor(scene: Scene, cellWidth: number, cellHeight: number, shift: Vector2, level: Level) {
        this.scene = scene;

        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.map = new Map({} as ILevel);
        this.level = level;

        this.shiftX = shift.x;
        this.shiftY = shift.y;

        console.log("MapController constructed with cell size", this.cellHeight, this.cellWidth);
        console.log("Shifted by: ", this.shiftX, this.shiftY);
    }

    public renderCurrentMap() {
        // this.loadLevelMap();

        this.renderMapCells();
    }

    public onSceneUpdate() {
        this.updateRenderedMap();
    }

    public checkWallCollision(snakePosition: Vector2) {
        return this.map.checkCollision(snakePosition) == CellType.Wall;
    }

    public checkSnakeEating(snakePosition: Vector2) {
        if (this.map.checkCollision(snakePosition) == CellType.Pickup) {
            return this.map.eatFood(snakePosition);
        }
        return undefined;
    }

    public checkStairCollision(snakePosition: Vector2): Stair | undefined {
        if (this.map.checkCollision(snakePosition) == CellType.Stairs) {
            return this.map.stairClimbed(snakePosition);
        }
        return undefined;
    }

    // public timedUpdate() {
    //     if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
    //         this.snake.rotateUp();
    //     } else if (JustDown(this.inputKeys.A) || JustDown(this.inputKeys.LEFT)) {
    //         this.snake.rotateLeft();
    //     } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
    //         this.snake.rotateDown();
    //     } else if (JustDown(this.inputKeys.D) || JustDown(this.inputKeys.RIGHT)) {
    //         this.snake.rotateRight();
    //     }
    //     this.snake.moveSnake();
    //     this.checkSnakeEating()
    // }

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

    }

    public getStairs() {
        let stairs: Stair[] = [];
        for (let el of this.map.childElements) {
            if ((el as Stair)?.identifier != undefined) {
                stairs.push(el as Stair);
            }
        }
        return stairs;
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

    public updateRenderedMap() {
        this.map.Map2D
            .forEach(row => row
                .forEach(cell => {
                    if (this.renderedCells[cell.x] == null) {
                        this.renderedCells[cell.x] = [];
                    }
                    this.renderedCells[cell.x][cell.y].setFillStyle(cell.color);
                }));
    }

    public setMapVisible() {
        this.renderedCells.forEach(row => row
            .forEach(cell => {
                cell.visible = true;
            })
        );
    }

    public setMapInvisible() {
        this.renderedCells.forEach(row => row
            .forEach(cell => {
                cell.visible = false;
            })
        );
    }
}