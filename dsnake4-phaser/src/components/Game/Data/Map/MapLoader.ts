import { Map } from './Map';
import { ILevel } from './JsonInterfaces';
import { MapLevel, MapLevelAssets } from '../Generics';
import { Wall } from './Wall';
import { Stair } from './Stair';
import { Loader, Cache } from 'phaser';

/**
 * Map creator. Currently a static implementation, so that the compiler can throw errors on the JSON side.
 */
export class MapLoader {

    /**
     * Put all static json levels into Phaser Scene cache (static)
     * @param cache 
     */
    static cacheLevelsStatic(cache: Cache.CacheManager) {
        MapLevelAssets.forEach(entry => {
            cache.json.add(entry.MapLevel.toString(), entry.static);
        });
    }

    /**
     * Put single static json level into Phaser Scene cache (static)
     * @param cache 
     * @param mapLevel 
     */
    static cacheStaticJsonLevel(cache: Cache.CacheManager, mapLevel: MapLevel) {
        const entry = MapLevelAssets.find(entry => entry.MapLevel == mapLevel);
        if (entry != null) {
            cache.json.add(entry.MapLevel.toString(), entry.static);
        } else {
            console.warn("Could not cache JSON level " + mapLevel.toString() + " from static assets. Did you deploy it with the app?");
        }
    }

    /**
     * Preloads all known json levels (server connection required)
     * @param load: Loader.LoaderPlugin
     */
    static preloadJsonLevels(load: Loader.LoaderPlugin) {
        MapLevelAssets.forEach(entry => {
            // MapLevel key maps to asset in scene cache after this
            load.json(entry.MapLevel.toString(), entry.path);
        });
    }

    /**
     * Preloads all known json levels (server connection required)
     * @param load: Loader.LoaderPlugin
     */
    static preloadLevelsDynamic(load: Loader.LoaderPlugin, mapLevel: MapLevel) {
        const entry = MapLevelAssets.find(entry => entry.MapLevel == mapLevel);
        if (entry != null) {
            return load.json(entry.MapLevel.toString(), entry.path);
        } else {
            console.warn("Could not preload JSON level " + mapLevel.toString() + " from remote server assets. Did you upload it?");
        }
    }

    /**
     * Loads one level from cache and converts it to a Map instance.
     * @param cache 
     * @param mapLevel 
     * @returns level 
     */
    static loadLevel(cache: Cache.CacheManager, mapLevel: MapLevel): Map {
        try {
            let jsonLevel: ILevel = cache.json.get(mapLevel.toString()) as ILevel;
            return this.convertLevelFile(jsonLevel);
        } catch (e) {
            console.log(e);
            throw new Error("Error during loading level '" + mapLevel + "'. Please check if you cached/preloaded it properly.");
        }
    }

    /**
     * Converts level data to a usable Map instance
     * @param jsonLevel 
     * @returns level file 
     */
    static convertLevelFile(jsonLevel: ILevel): Map {
        let newMap = new Map(jsonLevel);
        jsonLevel.walls?.forEach(wall => {
            newMap.appendElement(new Wall(wall.position, wall.length, wall.direction, wall.removable));
        });
        jsonLevel.stairs?.forEach(stair => {
            newMap.appendElement(new Stair(stair.identifier, stair.position, stair.height, stair.width, stair.exitDirection));
        });
        return newMap;
    }
}