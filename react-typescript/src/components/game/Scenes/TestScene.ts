import { TestJsonLevel } from '../Tests/TestJsonLevel';
import { TestBase } from '../Tests/TestBase';

export const UnitTestScene = "UnitTests";

export class TestRunnerScene extends Phaser.Scene {
    testSuites: TestBase[];

    constructor() {
        super(UnitTestScene);

        // Change this to auto-discovery with possibly class or decorators
        this.testSuites = [
            new TestJsonLevel(this)
        ];
    }

    preload() {
        console.warn("Registering and preloading tests.");
        this.testSuites.forEach(testSuite => {
            testSuite.preload(this.load);
        });
    }

    create() {
        console.log("TEST SCENE - created");
        this.testSuites.forEach(testSuite => {
            testSuite.execute();
        });
        console.warn("Ran: " + this.testSuites.length + " testSuites.");
        this.testSuites.forEach(suite => {
            console.log(suite.name);
            console.log('%c > Completed a test suite! ', 'color: lime');
        });
        this.scene.stop();
    }
}