import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { Stair } from '../Data/Map/Stair';
import { MapController } from '../Data/MapController';
import { BodyPart, Snake } from '../Data/Snake';
import { snakeTextStyle, CELLS_X, CELLS_Y, MapLevel as Level, Vector2 } from '../Data/Generics';
import { KeyBindings } from '../Data/KeyBindings';
import { Scene } from 'phaser';
import { JustDown } from '../imports';
import { MapLoader } from '../Data/Map/MapLoader';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game',
};

export const SnakeDelayMs: number = 75; // Snake speed

export class SnakeScene extends Phaser.Scene {
    private cellWidth!: number;
    private cellHeight!: number;

    shiftX!: number;
    shiftY!: number;

    snake!: Snake;
    currentLevel!: Level;
    points: number;

    private mapControllers: MapController[];
    inputKeys!: KeyBindings;

    private backgroundMusic!: Phaser.Sound.BaseSound;
    private stairSound!: Phaser.Sound.BaseSound;

    constructor(offset: Vector2) {
        super(sceneConfig);

        this.cellWidth = SW / CELLS_X;
        this.cellHeight = SH / CELLS_Y;

        this.shiftX = offset.x;
        this.shiftY = offset.y;

        this.points = 0;
        this.currentLevel = Level.FirstFloor;

        this.mapControllers = [];
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, offset, Level.FirstFloor));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, offset, Level.SecondFloor));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, offset, Level.ThirdFloor));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, offset, Level.Tropen));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, offset, Level.Shop));

        this.snake = new Snake(new Vector2(15, 16), 3, 'Right', this.currentLevel);

    }

    public preload() {
        // this.load.image('logo', 'img/assets/logo.png');
        this.load.audio('background', '/audio/bgMusic.mp3');
        this.load.audio('stair', '/audio/stair_sound.mp3');

        // Choose to load assets dynamically or statically
        MapLoader.cacheLevelsStatic(this.cache);
        // MapLoader.preloadJsonLevels(this.load);
        // MapLoader.preloadLevelsDynamic(this.load, MapLevel.FirstFloor);
    }

    public create() {        
        // Priority of drawing matters!
        this.inputKeys = this.input.keyboard.addKeys('W,UP,S,DOWN,A,LEFT,D,RIGHT') as KeyBindings;
        this.renderGrid();
        this.mapControllers.forEach(mc => {
            mc.loadLevelMap(MapLoader.loadLevel(this.cache, mc.level));
            mc.renderCurrentMap();
        });
        this.changeLevel(this.currentLevel);
        this.renderSnake();

        this.time.addEvent({ delay: SnakeDelayMs, callback: this.onTimedUpdate, callbackScope: this, loop: true });

        this.backgroundMusic = this.sound.add('background');
        this.stairSound = this.sound.add('stair');
        this.backgroundMusic.play({volume: 2, loop: true});
    }

    public update() {
        // Propagate input
        this.mapControllers.find(mc => mc.level == this.currentLevel)?.updateRenderedMap();
        // this.mapControllers.forEach(mc => mc.updateRenderedMap());
        this.renderSnake();
    }

    // Control over MapController's updates
    private onTimedUpdate() {
        if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
            this.snake.rotateUp();
        } else if (JustDown(this.inputKeys.A) || JustDown(this.inputKeys.LEFT)) {
            this.snake.rotateLeft();
        } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
            this.snake.rotateDown();
        } else if (JustDown(this.inputKeys.D) || JustDown(this.inputKeys.RIGHT)) {
            this.snake.rotateRight();
        }
        this.snake.moveSnake();

        let foodEaten = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkSnakeEating(this.snake.position);
        if (foodEaten != undefined) {
            this.points += foodEaten.points;
            this.snake.addUndigestedFood(foodEaten.blocksAdded);
            // boost charge
        }

        let wallCollision = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkWallCollision(this.snake.position);

        let stair = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkStairCollision(this.snake.position);
        if (stair != undefined) {
            this.stairClimbing(stair);
            this.stairSound.play({volume: 2, loop: false});
        }

        if (wallCollision) {
            let deathText = this.add.text(SW / 2, SH / 2, "You died!").setOrigin(0.5, 0.5);

            this.scene.pause();
            setTimeout(() => {
                // this.mapController.reset();
                this.reset();
                deathText.destroy();
                this.scene.resume();
            }, 1000);
        }
    }

    private stairClimbing(stair: Stair) {
        let nextStairData = this.getStairTo(stair.identifier);
        let stairTo = nextStairData.stair;
        let nextLevel = nextStairData.level;
        // let stairDirection = directionToVector2(stair.entryDirection);
        let offset: number = 0;
        // if (stairDirection == undefined) {
        //     throw Error('Error climbing stair')
        // }
        if (stair.exitDirection == 'Up' || stair.exitDirection == 'Down') {
            offset = this.snake.position.x - stair.position.x;
        }
        else if (stair.exitDirection == 'Right' || stair.exitDirection == 'Left') {
            offset = this.snake.position.y - stair.position.y;
        }

        let newX: number = 0;
        let newY: number = 0;
        let nMoves: number = 0;

        if (stairTo.exitDirection == 'Down') {
            newX = stairTo.position.x + offset;
            newY = stairTo.position.y;
            nMoves = stairTo.height;
        }
        else if (stairTo.exitDirection == 'Up') {
            newX = stairTo.position.x + offset;
            newY = stairTo.position.y + stairTo.height - 1;
            nMoves = stairTo.height;
        } else if (stairTo.exitDirection == 'Right') {
            newX = stairTo.position.x;
            newY = stairTo.position.y + offset;
            nMoves = stairTo.width;
        } else if (stairTo.exitDirection == 'Left') {
            newX = stairTo.position.x + stairTo.width - 1;
            newY = stairTo.position.y + offset;
            nMoves = stairTo.width;
        }
        console.log(newX, newY, nMoves, nextLevel, stairTo);
        this.snake.moveSnakeTo(new Vector2(newX, newY), nextLevel);
        this.snake.rotateSnake(stairTo.exitDirection);

        for (let i = 0; i < nMoves; i++) {
            this.snake.moveSnake();
        }

        this.changeLevel(nextLevel);
    }

    private getStairTo(identifier: string) {
        for (let mc of this.mapControllers) {
            if (mc.level != this.currentLevel) {
                for (let s of mc.getStairs()) {
                    if (s.identifier == identifier) {
                        return { 'stair': s, 'level': mc.level };
                    }
                }

            }
        }
        throw Error('Error finding the stair to climb to')
    }

    private changeLevel(newLevel: Level) {
        this.mapControllers.forEach(mc => {
            if (newLevel != mc.level) {
                mc.setMapInvisible();
            } else {
                mc.setMapVisible();
            }
        });
        this.currentLevel = newLevel;
    }

    private renderGrid() {
        this.add.grid(
            SW / 2 + this.shiftX, SH / 2 + this.shiftY,
            SW + 1, SH + 1,
            this.cellWidth, this.cellHeight,
            0x000000, 0, 0x222222, 0.9);
    }

    private renderSnake() {
        if (this.snake?.bodyParts != null) {
            this.snake.bodyParts.forEach(part => {
                this.renderSnakePart(part);
            });
        }
    }

    private renderSnakePart(part: BodyPart) {
        const pixelX = (part.x - 1) * this.cellWidth + 1 + this.shiftX;
        const pixelY = (part.y - 1) * this.cellHeight - 2 + this.shiftY;
        if (part.gameObject == null) {
            part.gameObject = this.add.text(pixelX, pixelY, part.toCharacter(), snakeTextStyle);
        }
        else {
            if (part.level == this.currentLevel) {
                part.gameObject.text = part.toCharacter();
                part.gameObject.setPosition(pixelX, pixelY);
                part.gameObject.visible = true;
            }
            else {
                part.gameObject.visible = false;
            }
        }
    }

    public getScore() {
        return this.points;
    }

    private reset() {
        this.snake.reset();
        this.snake = new Snake(new Vector2(15, 16), 3, 'Right', Level.FirstFloor);
        this.changeLevel(Level.FirstFloor);
    }
}
