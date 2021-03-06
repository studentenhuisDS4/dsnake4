import { default as level0 } from 'src/assets/static_levels/Level0.json';
import { default as level1 } from 'src/assets/static_levels/Level1.json';
import { default as level2 } from 'src/assets/static_levels/Level2.json';
import { default as level3 } from 'src/assets/static_levels/Level3Shop.json';
import { default as level4 } from 'src/assets/static_levels/Level4Tropen.json';
export type Direction = 'Up' | 'Right' | 'Left' | 'Down';

export enum CellType {
    'Wall',
    'Pickup',
    'Stairs',
    'Void',
    'Shop'
}

export enum MapLevel {
    'FirstFloor',
    'SecondFloor',
    'ThirdFloor',
    'Tropen',
    'Shop'
}

// Bundle references to static and dynamic levels in one place
const DynamicLevelPath = '/dynamic_levels/';
export const MapLevelAssets = [
    { 'MapLevel': MapLevel.FirstFloor, 'path': DynamicLevelPath + 'Level0.json', 'static': level0 },
    { 'MapLevel': MapLevel.SecondFloor, 'path': DynamicLevelPath + 'Level1.json', 'static': level1 },
    { 'MapLevel': MapLevel.ThirdFloor, 'path': DynamicLevelPath + 'Level2.json', 'static': level2 },
    { 'MapLevel': MapLevel.Shop, 'path': DynamicLevelPath + 'Level3Shop.json', 'static': level3 },
    { 'MapLevel': MapLevel.Tropen, 'path': DynamicLevelPath + 'Level4Tropen.json', 'static': level4 }
];

export type FoodType = 'Coffie' | 'Beer' | 'Weed' | 'Krant' | 'MainObject' | 'PowerUp';
export type PowerUpType = 'Joost' | 'Shrink' | 'Life';

export const CELLS_X: number = 105;
export const CELLS_Y: number = 60;

export const defaultTextStyle = {
    fontSize: 18,
    fontStyle: 'normal',
    // fontFamily: 'Consolas',
    color: "#42b983",
    backgroundColor: 'rgba(0,0,0,0)'
};

export const snakeTextStyle = {
    fontSize: 14,
    fontStyle: 'normal',
    // fontFamily: 'Consolas',
    color: "#42FF83",
    backgroundColor: 'rgba(0,0,0,0)'
};

export const Colors = {
    'Coffie': 0x60381C,
    'Beer': 0x000000,
    'Weed': 0x75AA45,
    'Krant': 0xCCCCCC,
    'MainObject': 0xFF0000,
    'Stair': 0x994C14,
    'Wall': 0xFFFFFF,
    'seeThroughWall': 0x999999,
    'purchasable': 0x00ff00,
    'nonPurchasable': 0xff0000,
    'purchased': 0x999999
};
