import { Direction, MapLevel } from '../Common';
import { Vector2 } from '../../Generics';

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
    identifier: string;
    position: Vector2;
    width: number;
    height: number;
    exitDirection: Direction;
}

export interface ILevel {
    name: string;
    level: MapLevel;
    walls: IWall[];
    stairs: IStairs[];
}