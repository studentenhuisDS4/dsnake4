import { Direction, CELLS_X, CELLS_Y } from './Generics';

export type MapCellType = 'Wall' | 'Pickup' | 'Stairs' | 'Void';

export class MapCell {
    /* 
    This class represents a single cell on the grid with a certain type.
    */
    x: number; // 0-oriented (until CELLS_X -1)
    y: number; // 0-oriented (until CELLS_Y -1)
    type: MapCellType;

    constructor(x: number, y: number, type: MapCellType) {
        if (type == null) {
            throw new Error("The MapCell type should be type 'Void', but not null | undefined.")
        } else {
            this.x = x;
            this.y = y;
            if (this.validateCoordinates()) {
                this.type = type;
            } else {
                throw new Error("The given coordinates do not fit the map.");
            }
        }
    }

    // Static function to clone object (not a deep clone!)
    clone() {
        return Object.create(this);
    }

    public validateCoordinates() {
        if (this.x >= 0 && this.y >= 0 &&
            this.x < CELLS_X && this.y < CELLS_Y) {
            return true;
        }
        else {
            return false;
        }
    }
}

export abstract class MapElement {
    /* 
    This class allows flattening any defined map object to an array of MapCells, which can be rendered.
    */
    cells!: MapCell[];

    public abstract generateCells(): void;
    public abstract resetCells(): void;
}

export class MapVector extends MapElement {
    /*
    This class allows adding hor/vert vectors and rendering them to a MapElement.
    Rendered elements end up in the cells property of MapElement.
     */
    readonly startCell: MapCell;
    readonly length: number = 0;
    readonly direction: Direction;

    constructor(startCell: MapCell, length: number, direction: Direction) {
        super();
        this.startCell = startCell;
        this.direction = direction;
        if (this.validateLength(length)) {
            this.length = length;
            this.generateCells();
        }
    }

    private validateLength(length: number) {
        if (length != null && length >= 0) {
            return true;
        } else {
            throw new Error("MapVector must have positive length (>1).");
        }
    }

    // Convert vector to array of 'MapCell's
    public generateCells() {
        this.resetCells();
        for (let i = 0; i < this.length; i++) {
            const newCell = this.startCell.clone();
            switch (this.direction) {
                case 'Up':
                    newCell.y -= i;
                    break;
                case 'Down':
                    newCell.y += i;
                    break;
                case 'Right':
                    newCell.x += i;
                    break;
                case 'Left':
                    newCell.x -= i;
                    break;
                default:
                    return;
            }
            if (newCell.validateCoordinates()) {
                this.cells.push(newCell);
            } else {
                // Skip throwing error, but a DEBUG warning might be nice.
                // console.log("The cell was setup outside the map and cant be rendered. Skipped cell.")
            }
        }
    }

    public resetCells(): void {
        this.cells = [];
    }
}


export class Map {
    /* 
    This class should calculate the map from all children elements.
    Do note that if children overlap, order of entry matters (we don't check overlap).
    
    Also note that calculating the final map should be done once (or at least not a lot).
    */
    private childElements: MapElement[];
    public Map2D!: MapCell[][];

    constructor() {
        this.childElements = [];
        this.constructMap();
    }

    public constructMap() {
        this.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 3, 'Up'));
        this.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 30, 'Down'));
        this.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 3, 'Left'));
        this.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 30, 'Right'));
        this.appendElement(new MapVector(new MapCell(1, 1, 'Wall'), 30, 'Right'));
        this.appendElement(new MapVector(new MapCell(10, 1, 'Wall'), 30, 'Right'));
        this.appendElement(new MapVector(new MapCell(1, 30, 'Wall'), 30, 'Right'));

        // TODO add easy way to define rooms, f.e. MapRectangle or MapStairs:
        // this.appendElement(new MapRectangle(x1, y1, 3, 'Up'));
        // this.loadMapFromImage(imageMap);
    }

    // This function performs the pre-processing to get an 2D-Array of cells in `this.Map2D`
    public flattenMap() {
        this.Map2D = [];
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
    }

    // public loadMapFromImage(imageMap: any) {
    //     throw new Error("The loadMapFromImage function has not been implemented yet.");
    // }

    public clearChildren() {
        this.childElements = [];
    }

    public clear2DMap() {
        this.Map2D = [];
    }

    public appendElement(element: MapElement) {
        this.childElements.push(element);
    }
}