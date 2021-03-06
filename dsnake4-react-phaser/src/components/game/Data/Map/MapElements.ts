import { Direction, CELLS_X, CELLS_Y, CellType, FoodType, MapLevel, PowerUpType} from '../Common';
import { Vector2 } from '../../Generics';

/**
 * Class `MapCell` represents a single cell on the grid with a certain type.
 */
export class MapCell {
    position: Vector2;
    type: CellType;
    color: number;

    /**
     * Gets x-position of body part (readonly)
     */
    get x(): number {
        return this.position.x;
    }

    // Backwards compat
    set x(value: number) {
        this.position.x = value;
    }

    /**
     * Gets y-position of body part (readonly)
     */
    get y(): number {
        return this.position.y;
    }

    // Backwards compat
    set y(value: number) {
        this.position.y = value;
    }

    constructor(position: Vector2, type: CellType, color?: number) {
        if (type == null) {
            throw new Error("The MapCell type should be type 'Void', but not null | undefined.");
        } else {
            this.position = position;
            if (this.validateCoordinates()) {
                this.type = type;
                this.color = (color == undefined) ? 0xEEEEEE : color;
            } else {
                throw new Error("The given coordinates do not fit the map.");
            }
        }
    }

    // Static function to clone object (and manual deep clone!)
    clone(): MapCell {
        let newElement = Object.create(this);
        newElement.position = Object.create(this.position);
        return newElement;
    }

    public validateCoordinates() {
        if (this.x > 0 && this.y > 0 &&
            this.x <= CELLS_X && this.y <= CELLS_Y) {
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

export class Food extends MapElement {
    public TopLeftCell: MapCell;
    public height: number;
    public width: number;
    public type: FoodType;
    public points!: number;
    public blocksAdded!: number;
    public boostCharge!: number;

    public image?: Phaser.GameObjects.Sprite;

    constructor(TopLeftCell: MapCell, type: FoodType, height: number, width: number) {
        super();
        this.TopLeftCell = TopLeftCell;
        this.type = type;
        this.height = height;
        this.width = width;

        this.generateCells();

        switch (this.type) {
            case 'Coffie':
                this.points = 20;
                this.blocksAdded = 1;
                break;
            case 'Beer':
                this.points = 20;
                this.blocksAdded = 1;
                break;
            case 'Weed':
                this.points = 20;
                this.blocksAdded = 1;
                break;
            case 'Krant':
                this.points = 20;
                this.blocksAdded = 1;
                break;
            case 'MainObject':
                this.points = 100;
                this.blocksAdded = 5;
                break;

        }
    }

    public generateCells(): void {
        this.resetCells();
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const newCell = this.TopLeftCell.clone();
                newCell.x += i;
                newCell.y += j;
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

}

export class MainObject extends Food {
    location: string;
    level: MapLevel;

    constructor(TopLeftCell: MapCell, type: FoodType, height: number, width: number, location: string, level: MapLevel) {
        super(TopLeftCell, type, height, width);
        this.location = location;
        this.level = level;
    }
}

export class PowerUp extends Food {
    public PType: PowerUpType;

    constructor(TopLeftCell: MapCell, type: FoodType, height: number, width: number, PowerupType: PowerUpType) {
        super(TopLeftCell, type, height, width);
        this.PType = PowerupType;
    }
}