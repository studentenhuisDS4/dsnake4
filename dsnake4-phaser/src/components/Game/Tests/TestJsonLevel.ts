import { TestBase } from './TestBase';
import { Scene, Loader } from 'phaser';
import { LEVELDATA } from '../Data/Generics';
import * as data from '@/assets/levels/Level2.json';

export class TestJsonLevel extends TestBase {
    name: string = "Test: .json levels";

    lvl1 = "Level1";
    constructor(scene: Scene) {
        super(scene);

        return this;
    }

    setUp(): void {

    }

    preload(loader: Loader.LoaderPlugin) {
        try {
            loader.json(this.lvl1, LEVELDATA.Level1);
        } catch (e) {
            console.warn("Preloading test-suite TestJsonLevel failed: ", e);
            return e;
        }
    }

    breakDown(): void {

    }

    runTests(): void {

    }

    private checkAssets() {
        let data = this.scene.cache.json.get(this.lvl1);
        // expect(data != null;
    }

}