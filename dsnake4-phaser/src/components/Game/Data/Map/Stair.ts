import { MapElement, MapCell } from './MapElements';
import { Direction, Vector2, CellType } from '../Generics';

export class Stair extends MapElement {
    public identifier: string;
    public position: Vector2;
    public height: number;
    public width: number;
    public exitDirection: Direction;

    constructor(identifier: string, position: Vector2, height: number, width: number, exitDir: Direction) {
        super();
        this.identifier = identifier;
        this.position = position;
        this.height = height;
        this.width = width;
        this.exitDirection = exitDir;

        this.generateCells();
    }

    public generateCells(): void {
        this.resetCells();
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                // console.log(this.position);
                const newPos = new Vector2(this.position.x, this.position.y) // this.position.clone();
                newPos.x += i;
                newPos.y += j;
                let newCell = new MapCell(newPos, CellType.Stairs, 0x909001);
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