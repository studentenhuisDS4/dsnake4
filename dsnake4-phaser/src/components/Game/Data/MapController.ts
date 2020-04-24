import { CELLS_Y, CELLS_X } from './Generics';
import { MapCellType, MapVector, MapCell, MapElement } from './MapElements';

export class MapController {
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
        const offsetX = 30;
        const offsetY = 30;
        this.appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Up'));
        this.appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Down'));
        this.appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Left'));
        this.appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Wall'), 3, 'Right'));
        // this.appendElement(new MapVector(new MapCell(offsetX, offsetY, 'Stairs'), 30, 'Right'));
        // this.appendElement(new MapVector(new MapCell(10, 1, 'Wall'), 30, 'Right'));
        // this.appendElement(new MapVector(new MapCell(1, 30, 'Wall'), 30, 'Right'));
    }

    public checkCollision(x: number, y: number): MapCellType {
        if (x <= 0 || x >= CELLS_X) {
            console.log('hit x wall', x);
            return 'Wall';
        }
        if (y <= 0 || y >= CELLS_Y) {
            console.log('hit y wall', x);
            return 'Wall';
        }
        if (this.Map2D[x] == null || this.Map2D[x][y] == null) {
            return 'Void';
        }
        return this.Map2D[x][y].type;
    }

    public getMapCell(x: number, y: number) {
        return this.Map2D[x][y];
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