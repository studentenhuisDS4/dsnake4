export type Direction = 'Up' | 'Right' | 'Left' | 'Down';

export type MapCellType = 'Wall' | 'Pickup' | 'Stairs' | 'SnakePart' | 'Void';
export type MapLevel = 'FirstFloor' | 'SecondFloor' | 'ThirdFloor' | 'Tropen' | 'Shop';
export type FoodType = 'Coffie' | 'Beer' | 'Weed' | 'Krant' | 'MainObject';

export const CELLS_X: number = 105;
export const CELLS_Y: number = 60;

export class LEVELDATA {
    static Level1 = "/levels/Level1.json";
    static Level2 = "/levels/Level2.json";
    static Level3 = "/levels/Level3.json";
    static Tropen = "/levels/Tropen.json";
}

export const defaultTextStyle = {
    fontSize: 18,
    fontStyle: 'normal',
    // fontFamily: 'Consolas',
    color: "#42b983",
    backgroundColor: 'rgba(0,0,0,0)'
};