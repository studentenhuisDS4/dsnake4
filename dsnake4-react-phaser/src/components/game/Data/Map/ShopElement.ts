import { MapCell, MapElement } from './MapElements';
import { CellType, Colors } from '../Common';
import { GameObjects } from 'phaser';
import { Vector2 } from '../../Generics';

export class ShopElement extends MapElement {
    position: Vector2;
    width: number;
    height: number;
    item!: ShopItem;
    status!: string;

    constructor(position: Vector2, height: number, width: number) {
        super();
        this.position = position;
        this.height = height;
        this.width = width;

        this.generateCells();
    }


    public generateCells(): void {
        this.resetCells();
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                // console.log(this.position);
                const newPos = new Vector2(this.position.x, this.position.y);
                newPos.x += i;
                newPos.y += j;
                let newCell = new MapCell(newPos, CellType.Shop, Colors.purchasable);
                if (newCell.validateCoordinates()) {
                    this.cells.push(newCell);
                } else {
                    // Skip throwing error, but a DEBUG warning might be nice.
                    // console.log("The cell was setup outside the map and cant be rendered. Skipped cell.")
                }
            }
        }
    }

    public resetCells(): void {
        this.cells = [];
    }

    public addItem(item: ShopItem) {
        this.item = item;
    }
}

export class ShopItem {
    description?: GameObjects.Sprite;
    code: string;
    cost: number;
    bought: boolean = false;

    constructor(code: string, cost: number, description?: GameObjects.Sprite) {
        this.code = code;
        this.cost = cost;
        this.description = description;
    }

    public buy() { this.bought = true; }
}