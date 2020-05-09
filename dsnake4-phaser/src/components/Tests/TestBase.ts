import { Scene, Loader } from 'phaser';

export abstract class TestBase {
    scene: Scene;
    abstract name: string;
    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * (Optional) one-time setup of tests, like storage, cache, connection or database
     */
    protected abstract setUp(): void;

    /**
     * Preloads test base, nice way to download assets before tests are run.
     * Note: this should be run by your Scene's `preload` method.
     * @param loader 
     */
    public abstract preload(loader: Loader.LoaderPlugin): void;

    /**
     * Aggregate and run registered tests
     */
    protected abstract runTests(): void;

    /**
     * (Optional) Clean-up after execution
     */
    protected abstract breakDown(): void;

    /**
     * Executes tests
     */
    public execute(): void {
        this.setUp();
        this.runTests();
        this.breakDown();
    }
} 