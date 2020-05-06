import { MapVector, MapCell } from './MapElements';
import { Direction, Vector2, CellType } from '../Generics';

export class Wall extends MapVector {
    readonly removable: boolean = false;

    public status: string = 'visible';

    constructor(position: Vector2, length: number, direction: Direction, removable?: boolean) {
        super(new MapCell(position, CellType.Wall), length, direction);

        if (removable != null) {
            this.removable = removable;
        }
    }

    public setStatus(status: string) {
        if (status == 'invisible' && this.removable) {
            this.status = status;
        } else if (status == 'visible') {
            this.status = status;
        } else if (status == 'seeThrough' && this.removable) {
            this.status = status;
        }
    }
}