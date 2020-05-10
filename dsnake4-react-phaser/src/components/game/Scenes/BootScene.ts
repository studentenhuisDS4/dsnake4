import { SceneMap } from '.';

interface ISceneMap {
    name: string;
    scene: object;
    start: boolean;
}

export class BootScene extends Phaser.Scene {
    create() {
        Object.entries(SceneMap).forEach(
            ([key, value]) => {
                this.addScene(value);
            }
        );
    }

    private addScene(sceneEntry: ISceneMap) {
        this.game.scene.add(sceneEntry.name, sceneEntry.scene, sceneEntry.start);
    }
}
