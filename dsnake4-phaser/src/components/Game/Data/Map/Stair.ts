import { MapVector, MapCell } from './MapElements';
import { Direction, Vector2, CellType } from '../Generics';

export class Stair extends MapVector {
    readonly removable: boolean = false;
    
    private visible: boolean = true;
    public get prop(): boolean {
        return this.visible;
    }

    constructor(position: Vector2, length: number, direction: Direction, removable?: boolean) {
        super(new MapCell(position, CellType.Wall), length, direction);

        if (removable != null) {
            this.removable = removable;
        }
    }

    public open() {
        this.setVisibility(true);
    }

    public close() {
        this.setVisibility(false);
    }

    private setVisibility(visible: boolean) {
        if (this.removable) {
            if (this.visible == true && visible == false) {
                this.visible = false;
            } else if(this.visible == false && visible == true) {
                this.visible = true;
            } else {
                console.warn("Trying to set wall visibility to a state it's already in.");
            }
        } else {
            throw Error("This Wall cannot be opened.");
        }
    }
}