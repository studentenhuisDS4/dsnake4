import { Stair } from './Map/Stair';
import { Scene } from 'phaser';
import { KeyBindings } from './KeyBindings';
import { Map } from './Map/Map';
import { Wall } from './Map/Wall'
import { MapLevel, CellType } from './Common';
import { ILevel } from './Map/JsonInterfaces';
import { Food } from './Map/MapElements';
import { ShopElement } from './Map/ShopElement';
import { Vector2 } from '../Generics'

export class MapController {
    private scene: Scene;
    public map: Map;
    public level: MapLevel;

    public active: boolean = false;

    cellHeight: number;
    cellWidth: number;
    inputKeys!: KeyBindings;

    renderedCells!: Phaser.GameObjects.Rectangle[][];

    beerCapsImage?: Phaser.GameObjects.Image;

    /**
     * Creates an instance of map controller.
     * Note: preloading JSON level is the responsibility of the Scene (take a look at MapLoader)
     * @param scene 
     * @param cellWidth 
     * @param cellHeight 
     * @param offset 
     */
    constructor(
        scene: Scene,
        cellWidth: number,
        cellHeight: number,
        level: MapLevel,
        beerCapsImage?: Phaser.GameObjects.Image
    ) {
        this.scene = scene;

        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.map = new Map({} as ILevel);
        this.level = level;

        this.beerCapsImage = beerCapsImage;

        // console.log("MapController constructed with cell size", this.cellHeight, this.cellWidth);
    }

    public renderCurrentMap() {
        this.renderMapCells();
    }

    public checkWallCollision(snakePosition: Vector2, throughWalls: boolean) {
        if (throughWalls) {
            for (let elem of this.map.childElements) {
                if (elem instanceof Wall) {
                    for (let cell of elem.cells) {
                        if (snakePosition.x == cell.position.x && snakePosition.y == cell.position.y && elem.status == 'visible') {
                            return true;
                        }
                    }
                }
            }
            return false;
        } else {
            return this.map.checkCollision(snakePosition) == CellType.Wall;
        }
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

    public checkShopCollision(snakePosition: Vector2): ShopElement | undefined {
        if (this.map.checkCollision(snakePosition) == CellType.Shop) {
            return this.map.shopItemHit(snakePosition);
        }
        return undefined;
    }

    public loadLevelMap(map: Map) {
        this.map = map;
        this.active = true;
        this.map.flattenMap();

        this.map.addRandomFood('Beer', 2, 2);
        this.map.addRandomFood('Beer', 2, 2);
        this.map.addRandomFood('Beer', 2, 2);
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
                        cell.x * this.cellWidth - this.cellWidth / 2,
                        cell.y * this.cellHeight - this.cellHeight / 2,
                        this.cellWidth, this.cellHeight,
                        cell.color);
                }));
    }


    public setMapVisible() {
        this.renderedCells.forEach(row => row
            .forEach(cell => {
                cell.visible = true;
            })
        );
        this.map.childElements.forEach(el => {
            if (el instanceof Food && el.image != undefined) {
                el.image.visible = true;
            }
        });
    }

    public setMapInvisible() {
        this.renderedCells.forEach(row => row
            .forEach(cell => {
                cell.visible = false;
            })
        );
        this.map.childElements.forEach(el => {
            if (el instanceof Food && el.image != undefined) {
                el.image.visible = false;
            }
        });
    }
}
