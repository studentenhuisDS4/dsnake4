import { TestBase } from './TestBase';
import { Scene, Loader } from 'phaser';
import * as level2Data from '@/assets/levels/Level2.json';
import { assert } from './Assertions';
import { ILevel } from '../Data/Map/JsonInterfaces';

export class TestJsonLevel extends TestBase {
    name: string = "Test - serve static .json data";

    lvl1 = "test_data";
    constructor(scene: Scene) {
        super(scene);

        return this;
    }

    setUp(): void {

    }

    preload(loader: Loader.LoaderPlugin) {
        loader.json(this.lvl1, "/test.json");
    }

    breakDown(): void {

    }

    runTests(): void {
        this.checkDynamicAsset();
        this.checkStaticAsset();
    }

    /**
     * Test: checks dynamically pre-loaded level in cache.
     */
    private checkDynamicAsset() {
        this.scene.cache.json.get(this.lvl1);
    }

    private checkStaticAsset() {
        // const level: ILevel = level2Data;
        // console.log(level);
        // assert(level);
    }

}