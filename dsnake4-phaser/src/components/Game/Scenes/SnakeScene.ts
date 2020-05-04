import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { Stair } from '../Data/Map/Stair';
import { MapController } from '../Data/MapController';
import { BodyPart, Snake } from '../Data/Snake';
import { snakeTextStyle, CELLS_X, CELLS_Y, MapLevel as Level, Vector2, MapLevel, CellType, Colors } from '../Data/Generics';
import { KeyBindings } from '../Data/KeyBindings';
import { Scene } from 'phaser';
import { JustDown } from '../imports';
import { MainObject, MapCell } from '../Data/Map/MapElements';
import { MapLoader } from '../Data/Map/MapLoader';
import { Vector } from 'matter';

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
    mainObjects!: MainObject[];

    private mapControllers: MapController[];
    inputKeys!: KeyBindings;

    private backgroundMusic!: Phaser.Sound.BaseSound;
    private stairSound!: Phaser.Sound.BaseSound;
    private wallImpactSound!: Phaser.Sound.BaseSound;
    private movementSound!: Phaser.Sound.BaseSound;
    private eatingSound!: Phaser.Sound.BaseSound;



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
        this.load.audio('background', '/audio/DSnake4.mp3');
        this.load.audio('stair', '/audio/stair_sound.mp3');
        this.load.audio('wall', '/audio/impactWall.ogg');
        this.load.audio('movement', '/audio/movement.ogg');
        this.load.audio('eating', '/audio/handleCoins.ogg');
        this.load.image('floor', ['img/assets/floor.png', 'img/assets/floor_n.png']);

        // Choose to load assets dynamically or statically
        MapLoader.cacheLevelsStatic(this.cache);
        // MapLoader.preloadJsonLevels(this.load);
        // MapLoader.preloadLevelsDynamic(this.load, MapLevel.FirstFloor);
    }

    public create() {
        // Priority of drawing matters!
        this.inputKeys = this.input.keyboard.addKeys('W,UP,S,DOWN,A,LEFT,D,RIGHT') as KeyBindings;

        this.add
            .image(this.shiftX, this.shiftY, 'floor')
            .setOrigin(0, 0)
            .setAlpha(0.7)
            .setScale(0.24, 0.24)
            .setPipeline('Light2D');
        this.lights.enable();
        this.lights.setAmbientColor(0x313339);
        // this.lights.addLight(500, 300, 200, 0xffffff, 1);

        const snakeLight = this.lights.addLight(0, 0, 400, 0x42b983, 1);

        // The mouse is fun, but the moon is calling us more. Agreed -Andrea
        // this.input.on('pointermove', function (event: MouseEvent) {
        //     light.x = event.x;
        //     light.y = event.y;
        // });

        this.events.on('gameSnakeMove', function (event: Snake, shiftX: number, shiftY: number) {
            for (let i = 0; i < 6; i++) {
                snakeLight.x = event.position.x * 10 + shiftX;
                snakeLight.y = event.position.y * 10 + shiftX;
            }
        });

        // this.renderGrid();

        this.mapControllers.forEach(mc => {
            mc.loadLevelMap(MapLoader.loadLevel(this.cache, mc.level));
            mc.renderCurrentMap();
        });
        this.changeLevel(this.currentLevel);
        this.renderSnake();

        this.time.addEvent({ delay: SnakeDelayMs, callback: this.onTimedUpdate, callbackScope: this, loop: true });

        this.backgroundMusic = this.sound.add('background');
        this.stairSound = this.sound.add('stair');
        this.wallImpactSound = this.sound.add('wall');
        this.movementSound = this.sound.add('movement');
        this.eatingSound = this.sound.add('eating');
        this.backgroundMusic.play({ volume: 0.5, loop: true });

        this.generateMainObjects();
        this.addAllMainObjects();
    }

    public update() {
        // Propagate input
        this.mapControllers.find(mc => mc.level == this.currentLevel)?.updateRenderedMap();
        // this.mapControllers.forEach(mc => mc.updateRenderedMap());
        this.renderSnake();
    }

    // Control over MapController's updates
    private onTimedUpdate() {
        let direction = this.snake.direction;
        if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
            this.snake.rotateUp();
        } else if (JustDown(this.inputKeys.A) || JustDown(this.inputKeys.LEFT)) {
            this.snake.rotateLeft();
        } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
            this.snake.rotateDown();
        } else if (JustDown(this.inputKeys.D) || JustDown(this.inputKeys.RIGHT)) {
            this.snake.rotateRight();
        }
        if (direction != this.snake.direction) {
            this.movementSound.play({ volume: 0.1, loop: false });

        }
        this.snake.moveSnake();

        let foodEaten = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkSnakeEating(this.snake.position);
        if (foodEaten != undefined) {
            this.points += foodEaten.points;
            this.snake.addUndigestedFood(foodEaten.blocksAdded);
            this.eatingSound.play({ volume: 0.5, loop: false });
            // boost charge
        }

        let wallCollision = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkWallCollision(this.snake.position);

        let stair = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkStairCollision(this.snake.position);
        if (stair != undefined) {
            this.stairClimbing(stair);
            this.stairSound.play({ volume: 0.1, loop: false, rate: 2 });
        }

        if (wallCollision) {
            this.wallImpactSound.play({ volume: .5, loop: false });
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
        this.events.emit('gameSnakeMove', this.snake, this.shiftX, this.shiftY);
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

    private generateMainObjects() {
        this.mainObjects = [];
        let merelRoom = Math.random();
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(13, 37), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Ben\'s Room', MapLevel.FirstFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(10, 52), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Sven\'s Room', MapLevel.FirstFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(35, 38), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Andrea\'s Room', MapLevel.FirstFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(88, 8), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Jeffery\'s Room', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(98, 35), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Daan\'s Room', MapLevel.FirstFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(98, 52), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Hannele\'s Room', MapLevel.FirstFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(8, 10), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Cork\'s Room', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(11, 40), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Miel\'s Room', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(31, 40), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Margot\'s Room', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(55, 25), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'the GR', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(78, 40), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Janis\' Room', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(97, 40), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Luuk\'s Room', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(40, 10), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Jerry\'s Room', MapLevel.ThirdFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(14, 10), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Quentin\'s Room', MapLevel.ThirdFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(12, 30), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Marloes\' Room', MapLevel.ThirdFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(95, 20), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Marcus\' Room', MapLevel.ThirdFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(70, 48), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Lotte\'s Room', MapLevel.ThirdFloor));
        if (merelRoom < 0.5) {
            this.mainObjects.push(new MainObject(new MapCell(new Vector2(21, 8), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Merel\'s Lower Room', MapLevel.SecondFloor));
        } else {
            this.mainObjects.push(new MainObject(new MapCell(new Vector2(44, 30), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Merel\'s Upper Room', MapLevel.ThirdFloor));
        }
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(28, 48), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Charlie\'s Room', MapLevel.Tropen));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(78, 46), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Fenna\'s Room', MapLevel.Tropen));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(28, 26), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'David\'s Room', MapLevel.Tropen));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(34, 8), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Jarno\'s Room', MapLevel.Tropen));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(71, 8), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'Ilse\'s Room', MapLevel.Tropen));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(50, 45), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'the Kitchen', MapLevel.FirstFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(53, 55), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'the Front Yard', MapLevel.SecondFloor));
        this.mainObjects.push(new MainObject(new MapCell(new Vector2(53, 15), CellType.Pickup, Colors.MainObject), 'MainObject', 2, 2, 'the Binnenplaats', MapLevel.FirstFloor));
    }

    private reset() {
        this.snake.reset();
        this.snake = new Snake(new Vector2(15, 16), 3, 'Right', Level.FirstFloor);
        this.changeLevel(Level.FirstFloor);
    }

    private addAllMainObjects() {
        for (let mo of this.mainObjects) {
            this.mapControllers.find(mc => mc.level === mo.level)?.map.appendElement(mo, true);
        }
    }
}
