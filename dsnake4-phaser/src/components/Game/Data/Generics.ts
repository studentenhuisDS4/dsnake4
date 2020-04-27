export type Direction = 'Up' | 'Right' | 'Left' | 'Down';

// export type MapCellType = 'Wall' | 'Pickup' | 'Stairs' | 'SnakePart' | 'Void';
// export type MapLevel = 'FirstFloor' | 'SecondFloor' | 'ThirdFloor' | 'Tropen' | 'Shop';
export enum CellType {
    'Wall',
    'Pickup',
    'Stairs',
    'Void'
}

export enum MapLevel {
    'FirstFloor',
    'SecondFloor',
    'ThirdFloor',
    'Tropen',
    'Shop'
}

export const CELLS_X: number = 105;
export const CELLS_Y: number = 60;

export const defaultTextStyle = {
    fontSize: 18,
    fontStyle: 'normal',
    // fontFamily: 'Consolas',
    color: "#42b983",
    backgroundColor: 'rgba(0,0,0,0)'
};

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}