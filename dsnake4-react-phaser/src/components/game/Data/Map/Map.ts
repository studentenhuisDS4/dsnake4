import { MapElement, MapCell, Food } from './MapElements';
import { Stair } from './Stair'
import { CELLS_Y, CELLS_X, CellType, Colors, FoodType } from '../Common';
import { ILevel } from './JsonInterfaces';
import { ShopElement } from './ShopElement';
import { Vector2 } from '../../Generics';


export class Map {
    /* 
    This class should calculate the map from all children elements.
    Do note that if children overlap, order of entry matters (we don't check overlap).
    
    Also note that calculating the final map should be done once (or at least not a lot) with `flattenMap`.
    */
    readonly jsonData: ILevel;
    public childElements: MapElement[];
    public Map2D!: MapCell[][];

    /**
     * Creates an instance of Map, where the originalData is kept for future map-creator features.
     * @param originalData 
     */
    constructor(originalData: ILevel) {
        this.jsonData = originalData;
        this.childElements = [];
    }

    public checkCollision(pos: Vector2): CellType {
        if (pos.x <= 0 || pos.x > CELLS_X) {
            console.log('hit x wall', pos.x);
            return CellType.Wall;
        }
        if (pos.y <= 0 || pos.y > CELLS_Y) {
            console.log('hit y wall', pos.x);
            return CellType.Wall;
        }
        if (this.Map2D[pos.x] == null || this.Map2D[pos.x][pos.y] == null) {
            return CellType.Void;
        }
        return this.Map2D[pos.x][pos.y].type;
    }

    public eatFood(pos: Vector2) {
        for (let i = 0; i < this.childElements.length; i++) {
            let el = this.childElements[i];
            if (el instanceof Food) {
                if (el.TopLeftCell.x <= pos.x && el.TopLeftCell.x + el.width >= pos.x && el.TopLeftCell.y <= pos.y && el.TopLeftCell.y + el.height >= pos.y) {
                    let foodEaten = Object.assign({}, el);
                    if (el.image != undefined) {
                        el.image.destroy();
                    }
                    this.childElements.splice(i, 1);
                    this.flattenMap();

                    return foodEaten;
                }

            }
        }
    }

    public stairClimbed(pos: Vector2): Stair | undefined {
        for (let el of this.childElements) {
            for (let cell of el.cells) {
                if (cell.position.x == pos.x && cell.position.y == pos.y && this.Map2D[cell.position.x][cell.position.y].type == CellType.Stairs) {
                    return el as Stair;
                }
            }
        }
        console.log('stairClimbed went wrong');
        return undefined;
    }

    public shopItemHit(pos: Vector2): ShopElement | undefined {
        for (let el of this.childElements) {
            if (el instanceof ShopElement) {
                for (let cell of el.cells) {
                    if (cell.position.x == pos.x && cell.position.y == pos.y && this.Map2D[cell.position.x][cell.position.y].type == CellType.Shop) {
                        return el as ShopElement;
                    }
                }
            }
        }
        console.log('stairClimbed went wrong');
        return undefined;
    }

    public addFood(food: Food) {
        this.appendElement(food, true);
    }

    public addRandomFood(type?: FoodType, width?: number, height?: number) {
        let foodValidation: boolean = false;

        if (type == undefined) {
            let t = Math.floor(Math.random() * 4);
            switch (t) {
                case 0:
                    type = 'Coffie';
                    break;
                case 1:
                    type = 'Beer';
                    break;
                case 2:
                    type = 'Weed';
                    break;
                case 3:
                    type = 'Krant';
                    break;
                default:
                    type = 'Coffie';
                    console.log('Error creating food');
            }
        }
        if (height == undefined) {
            height = 1;
        }
        if (width == undefined) {
            width = 1;
        }

        let x: number = 0;
        let y: number = 0;
        while (!foodValidation) {
            x = Math.floor(Math.random() * CELLS_X) + 1;
            y = Math.floor(Math.random() * CELLS_Y) + 1;

            foodValidation = this.validateFoodLocation(x, y, height, width);
        }
        this.addFood(new Food(new MapCell(new Vector2(x, y), CellType.Pickup, Colors[type]), type, height, width));

    }

    public validateFoodLocation(x: number, y: number, height: number, width: number): boolean {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (this.Map2D[x + i][y + j].type != CellType.Void) { return false; }
            }
        }
        return true;
    }

    public getMapCell(x: number, y: number) {
        return this.Map2D[x][y];
    }

    /**
     * Appends new elements to the map and flattens it when 
     * @param element 
     * @returns  
     */
    public appendElement(element: MapElement, flatten?: boolean) {
        this.childElements.push(element);

        if (flatten === true) {
            this.flattenChildElement(element);
        }

        // Make fluent
        return this;
    }

    /**
     * Flattens map, which is the pre-processing to get an 2D-Array of cells in `this.Map2D`
     */
    public flattenMap(): Map {
        this.clear2DMap();
        if (this.childElements != null) {
            this.childElements.forEach(elem => {
                this.flattenChildElement(elem);
            });
        }
        for (let x = 1; x <= CELLS_X; x++) {
            for (let y = 1; y <= CELLS_Y; y++) {
                if (this.Map2D[x] == null) {
                    this.Map2D[x] = [];
                }
                if (this.Map2D[x][y] == null) {
                    this.Map2D[x][y] = new MapCell(new Vector2(x, y), CellType.Void, 0x000000);
                }
            }
        }

        return this;
    }

    private flattenChildElement(elem: MapElement) {
        elem.cells.forEach(elemCell => {
            if (this.Map2D[elemCell.x] == null) {
                this.Map2D[elemCell.x] = [];
            }

            this.Map2D[elemCell.x][elemCell.y] = elemCell.clone();
        })
    }

    public clearChildren() {
        this.childElements = [];
    }

    public clear2DMap() {
        this.Map2D = [];
    }

}
