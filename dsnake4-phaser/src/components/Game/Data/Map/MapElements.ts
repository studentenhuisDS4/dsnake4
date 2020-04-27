import { Direction, CELLS_X, CELLS_Y, CellType } from '../Generics';

/**
 * Class `MapCell` represents a single cell on the grid with a certain type.
 */
export class MapCell {
    x: number; // 0-oriented (until CELLS_X -1)
    y: number; // 0-oriented (until CELLS_Y -1)
    type: CellType;

    constructor(x: number, y: number, type: CellType) {
        if (type == null) {
            throw new Error("The MapCell type should be type 'Void', but not null | undefined.");
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

/**
 * The `MapElement` class allows flattening any defined map object to an array of MapCells, which can be rendered.
 */
export abstract class MapElement {
    cells!: MapCell[];

    public abstract generateCells(): void;
    public abstract resetCells(): void;
}

/**
 * `MapVector`allows defining hor/vert vectors and rendering them to a MapElement.
    Rendered elements end up in the cells property of MapElement.
 */
export class MapVector extends MapElement {
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

    /**
     * Convert vector to array of 'MapCell's
     * @returns  
     */
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