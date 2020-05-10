import { TestJsonLevel } from '../Tests/TestJsonLevel';
import { TestBase } from '../Tests/TestBase';

export const UnitTestScene = "UnitTests";
export const snakeTextStyle = {
    fontSize: 14,
    fontStyle: 'normal',
    // fontFamily: 'Consolas',
    color: "#42FF83",
    backgroundColor: 'rgba(0,0,0,0)'
};
export class TestRunnerScene extends Phaser.Scene {
    testSuites: TestBase[];

    constructor() {
        super({
            key: UnitTestScene
        } as Phaser.Types.Scenes.SettingsConfig);

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
            this.add
                .text(50, 50, 'MENU', snakeTextStyle)
                .setOrigin(1, 0);
        });
        this.scene.stop();
    }
}
