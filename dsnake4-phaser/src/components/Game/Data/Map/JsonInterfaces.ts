import { Direction, MapLevel, Vector2 } from '../Generics';

/**
 * Interface `IWall` defines 
 */
export interface IWall {
    position: Vector2;
    direction: Direction;
    length: number;
    removable?: boolean; // Has default
    visible?: boolean; // Has default
}

export interface IStairs {
    identifier: string;     // Linked stair
    
    position: Vector2;
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