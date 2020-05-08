import { TestBase } from './TestBase';
import { Scene, Loader } from 'phaser';
import { assert as assertNotFalsy } from './Assertions';
import { ILevel } from '../Data/Map/JsonInterfaces';
import { MapLoader } from '../Data/Map/MapLoader';
import { MapLevel, MapLevelAssets } from '../Data/Common';

export class TestJsonLevel extends TestBase {
    name: string = "Test - serve static .json data";

    lvl1 = "level1";
    constructor(scene: Scene) {
        super(scene);

        return this;
    }

    setUp(): void {

    }

    preload(loader: Loader.LoaderPlugin) {
        loader.json(this.lvl1, "dynamic_levels/Level0.json");
        MapLoader.preloadJsonLevels(loader);
    }

    breakDown(): void {

    }

    runTests(): void {
        this.checkDynamicAsset();
        this.checkAllDynamicJsonAssets();

        // Perform static tests later, as they clear cache
        this.testStaticAssetLoader();
        this.checkStaticAsset();
    }

    /**
     * Test: checks dynamically pre-loaded levels in cache.
     */
    private checkAllDynamicJsonAssets() {
        MapLevelAssets.forEach(asset => {
            const data = this.scene.cache.json.get(asset.MapLevel.toString());
            assertNotFalsy(data);
        });
    }

    /**
     * Test: checks 1 dynamically pre-loaded level in cache.
     */
    private checkDynamicAsset() {
        const data = this.scene.cache.json.get(this.lvl1);
        console.log(data);
        assertNotFalsy(data);
    }

    /**
     * Tryout a load of a JSON statically.
     * This validates the level files as well, so it serves a purpose.
     */
    private checkStaticAsset() {
        MapLevelAssets.forEach(level => assertNotFalsy(level));
    }

    private testStaticAssetLoader() {
        const level = MapLevel.FirstFloor;
        const key = level.toString();

        // Explicitly refresh key in cache.json
        this.scene.cache.json.remove(key);
        MapLoader.cacheStaticJsonLevel(this.scene.cache, level);

        const loadedData = this.scene.cache.json.get(key) as ILevel;
        assertNotFalsy(loadedData?.name);
        assertNotFalsy(loadedData.level == level);

        const map = MapLoader.loadLevel(this.scene.cache, MapLevel.FirstFloor);
        map.flattenMap();
        assertNotFalsy(map);
        assertNotFalsy(map.Map2D);
    }

}