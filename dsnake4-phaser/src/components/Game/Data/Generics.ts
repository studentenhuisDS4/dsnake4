export type Direction = 'Up' | 'Right' | 'Left' | 'Down';

export type MapCellType = 'Wall' | 'Pickup' | 'Stairs' | 'SnakePart' | 'Void';
export type MapLevel = 'FirstFloor' | 'SecondFloor' | 'ThirdFloor' | 'Tropen' | 'Shop';

export const CELLS_X: number = 105;
export const CELLS_Y: number = 60;