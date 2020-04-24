import { Scene } from 'phaser';

/* Some class for later to move the snake functionality to.
    This way scenes are independent of the snake interaction. */
export class Player {
    private scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
        
    }
}