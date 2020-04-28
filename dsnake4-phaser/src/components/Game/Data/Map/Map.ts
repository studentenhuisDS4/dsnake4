import { MapElement, MapCell, Food } from './MapElements';
import { CELLS_Y, CELLS_X, CellType, MapLevel, FoodType, foodColors } from '../Generics';

export class Map {
    /* 
    This class should calculate the map from all children elements.
    Do note that if children overlap, order of entry matters (we don't check overlap).
    
    Also note that calculating the final map should be done once (or at least not a lot) with `flattenMap`.
    */
    readonly mapLevel: MapLevel;
    private childElements: MapElement[];
    public Map2D!: MapCell[][];

    constructor(mapLevel: MapLevel) {
        this.mapLevel = mapLevel;
        this.childElements = [];
    }

    public checkCollision(x: number, y: number): CellType {
        if (x <= 0 || x >= CELLS_X) {
            console.log('hit x wall', x);
            return CellType.Wall;
        }
        if (y <= 0 || y >= CELLS_Y) {
            console.log('hit y wall', x);
            return CellType.Wall;
        }
        if (this.Map2D[x] == null || this.Map2D[x][y] == null) {
            return CellType.Void;
        }
        return this.Map2D[x][y].type;
    }

    /**
     * Removes eaten food from map, recalculates Map2D, returns the properties of the eaten food
     */
    public EatFood(x: number, y: number) {
        for (let i = 0; i < this.childElements.length; i++) {
            let el = this.childElements[i];
            if (el instanceof Food) {
                if (el.TopLeftCell.x <= x && el.TopLeftCell.x + el.width >= x && el.TopLeftCell.y <= y && el.TopLeftCell.y + el.height >= y) {
                    let properties: number[] = [el.points, el.blocksAdded, el.boostCharge];
                    this.childElements.splice(i, 1)
                    this.flattenMap();

                    return properties;
                }

            }
        }
    }

    public addFood(food: Food) {
        this.appendElement(food);
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
        this.addFood(new Food(new MapCell(x, y, CellType.Pickup, foodColors[type]), type, height, width));
        console.log(type, foodColors[type]);
        
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
     * Flattens map, which is the pre-processing to get an 2D-Array of cells in `this.Map2D`
     */
    public flattenMap() {
        this.clear2DMap();
        if (this.childElements != null) {
            this.childElements.forEach(elem => {
                elem.cells.forEach(elemCell => {
                    if (this.Map2D[elemCell.x] == null) {
                        this.Map2D[elemCell.x] = [];
                    }
                    this.Map2D[elemCell.x][elemCell.y] = elemCell.clone();
                })
            });
        }
        for (let x = 1; x <= CELLS_X; x++) {
            for (let y = 1; y <= CELLS_Y; y++) {
                if (this.Map2D[x][y] == null) {
                    this.Map2D[x][y] = new MapCell(x, y, CellType.Void, 0x000000);
                }
            }
        }
    }

    public clearChildren() {
        this.childElements = [];
    }

    public clear2DMap() {
        this.Map2D = [];
    }

    public appendElement(element: MapElement) {
        this.childElements.push(element);

        // Make fluent
        return this;
    }
}