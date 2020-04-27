import { Direction, MapLevel } from '../Generics';
import { Map } from './Map';

export interface IWall {
    x: number;
    y: number;
    length: number;
    direction: Direction;
    removable?: boolean; // Has default
    visible?: boolean; // Has default
}

export interface IStairs {
    // Unique key and key of other level
    key: string;
    mirrorKey: string;

    x: number;
    y: number;
    width: number;
    height: number;

    opened: boolean;
    opens: MapLevel;

    // Customize how the snake will enter the level from these stairs
    entryDirection?: Direction;
    enterOffsetX?: number;
    enterOffsetY?: number;
}

export interface ILevel {
    name: string;
    level: MapLevel;
    walls: IWall[];
    stairs: IStairs[];
}

export class LevelHelper {

    public static parseJsonLevel(levelData: JSON): Map | null {
        return null;
    };
}