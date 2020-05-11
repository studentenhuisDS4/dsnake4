import * as Phaser from 'phaser';
import { SW, SH } from '../GameConfig';
import { Stair } from '../Data/Map/Stair';
import { ShopElement, ShopItem } from '../Data/Map/ShopElement';
import { MapController } from '../Data/MapController';
import { CELLS_X, MapLevel, CellType, Colors, CELLS_Y } from '../Data/Common';
import { KeyBindings } from '../Data/KeyBindings';
import { Scene } from 'phaser';
import { JustDown } from '../imports';
import { MainObject, MapCell, Food } from '../Data/Map/MapElements';
import { Wall } from '../Data/Map/Wall'
import { MapLoader } from '../Data/Map/MapLoader';
import { Transform, Vector2 } from '../Generics';
import { TransformScene } from '../GameObjects/TransformScene';
import { Snake, BodyPart } from '../Data/Snake';
import { SceneEvents } from '../Events';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true
};

export class SnakeScene extends TransformScene {
    private cellWidth!: number;
    private cellHeight!: number;

    snake!: Snake;

    currentLevel!: MapLevel;
    mainObjects!: MainObject[];
    shopItems!: ShopItem[];

    points!: number;
    lives!: number;
    joostPotions!: number;
    joostPotionCounter!: number;
    readonly joostPotionDuration: number = 105;
    throughWalls!: boolean;

    // Snake game loop
    private mapControllers!: MapController[];
    private shopEl!: ShopElement[];
    inputKeys!: KeyBindings;

    private backgroundMusic!: Phaser.Sound.BaseSound;
    private stairSound!: Phaser.Sound.BaseSound;
    private wallImpactSound!: Phaser.Sound.BaseSound;
    private movementSound!: Phaser.Sound.BaseSound;
    private eatingSound!: Phaser.Sound.BaseSound;

    private renderCount: number = 0;
    moveTime: number = 0;
    deltaTime: number = 50;

    constructor(transform?: Transform) {
        super(sceneConfig, transform);
    }

    public init() {
        this.cellWidth = this.game.scale.width / CELLS_X;
        this.cellHeight = this.cellWidth;

        this.mapControllers = [];
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, MapLevel.FirstFloor));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, MapLevel.SecondFloor));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, MapLevel.ThirdFloor));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, MapLevel.Tropen));
        this.mapControllers.push(new MapController(this as Scene, this.cellWidth, this.cellHeight, MapLevel.Shop));

        this.game.events.addListener(SceneEvents.UpdatedGameSize, () => {
            this.cellWidth = this.game.scale.width / CELLS_X;
            this.cellHeight = this.cellWidth;
        });
    }

    /**
     * Load assets dynamically or statically
     */
    public preload() {
        this.load.audio('background', '/audio/DSnake4_mixdown.mp3');
        this.load.audio('stair', '/audio/stair_sound.mp3');
        this.load.audio('wall', '/audio/impactWall.ogg');
        this.load.audio('movement', '/audio/movement.ogg');
        this.load.audio('eating', '/audio/handleCoins.ogg');
        this.load.image('floor', ['img/assets/floor.png', 'img/assets/floor_n.png']);
        this.load.spritesheet('beerCaps', 'img/assets/beerCaps/sprite20000.png', { frameWidth: 20, frameHeight: 20 });
        this.load.spritesheet('snakeHead', 'img/assets/Snake/headSprite.png', { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet('snakeBody', 'img/assets/Snake/bodySprite.png', { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet('snakeTail', 'img/assets/Snake/tailSprite.png', { frameWidth: 10, frameHeight: 10 });
        this.load.image('JPdesc', 'img/assets/JPdescription.png');
        this.load.image('ELdesc', 'img/assets/ELdescription.png');

        // Choose to load assets dynamically or statically
        MapLoader.cacheLevelsStatic(this.cache);
    }

    public create(data: any) {
        this.applyCameraTransform(data?.transform);

        // Priority of drawing matters!
        this.inputKeys = this.input.keyboard.addKeys('W,UP,S,DOWN,A,LEFT,D,RIGHT,J') as KeyBindings;

        this.add
            .image(0, 0, 'floor')
            .setOrigin(0, 0)
            .setAlpha(0.7)
            .setDisplaySize(this.game.scale.width, this.game.scale.width / CELLS_X * CELLS_Y)
            .setPipeline('Light2D');

        this.lights.enable();
        this.lights.setAmbientColor(0x313339);
        const snakeLight = this.lights.addLight(0, 0, 400, 0x42b983, 1);

        this.events.on('gameSnakeMove', function (scene: SnakeScene) {
            for (let i = 0; i < 6; i++) {
                snakeLight.x = scene.snake.position.x * scene.cellWidth;
                snakeLight.y = scene.snake.position.y * scene.cellHeight;
            }
        }, this);

        this.mapControllers.forEach(mc => {
            mc.loadLevelMap(MapLoader.loadLevel(this.cache, mc.level));
            mc.renderMapCells();
            this.updateRenderedMap(mc);
        });

        this.shopEl = [];
        this.shopEl[0] = new ShopElement(new Vector2(2, 2), 19, 34);
        this.shopEl[1] = new ShopElement(new Vector2(37, 2), 19, 33);
        this.shopEl[2] = new ShopElement(new Vector2(71, 2), 19, 34);
        this.mapControllers[4].map.appendElement(this.shopEl[0], true);
        this.mapControllers[4].map.appendElement(this.shopEl[1], true);
        this.mapControllers[4].map.appendElement(this.shopEl[2], true);

        this.changeLevel(this.currentLevel);

        this.backgroundMusic = this.sound.add('background');
        this.stairSound = this.sound.add('stair');
        this.wallImpactSound = this.sound.add('wall');
        this.movementSound = this.sound.add('movement');
        this.eatingSound = this.sound.add('eating');
        this.backgroundMusic.play({ volume: 0, loop: true });

        this.generateMainObjects();
        this.addAllMainObjects();

        this.mapControllers.forEach(mc => { this.updateRenderedMap(mc); });
        this.resetGame();
        this.changeLevel(this.currentLevel);
        this.renderSnake();
    }

    public update(time: number) {
        let direction = this.snake.direction;
        if (JustDown(this.inputKeys.W) || JustDown(this.inputKeys.UP)) {
            this.snake.rotateUp();
        } else if (JustDown(this.inputKeys.A) || JustDown(this.inputKeys.LEFT)) {
            this.snake.rotateLeft();
        } else if (JustDown(this.inputKeys.S) || JustDown(this.inputKeys.DOWN)) {
            this.snake.rotateDown();
        } else if (JustDown(this.inputKeys.D) || JustDown(this.inputKeys.RIGHT)) {
            this.snake.rotateRight();
        } else if (JustDown(this.inputKeys.J)) {
            if (this.joostPotions > 0 && this.throughWalls == false) {
                this.joostPotions--;
                this.joostPotionCounter = this.joostPotionDuration;
                this.activateThroughWalls();
            } else {
                console.warn('Can\'t use potion right now');
            }
        }

        if (direction != this.snake.direction) {
            this.movementSound.play({ volume: 0.1, loop: false });
        }

        if (time > this.moveTime) {
            // Propagate input
            this.onTimedUpdate();
            this.renderSnake();
            this.moveTime = time + this.deltaTime;
        }
    }

    private onTimedUpdate() {
        this.snake.moveSnake();

        let foodEaten = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkSnakeEating(this.snake.position);
        if (foodEaten != undefined) {
            if (foodEaten.type == 'MainObject') { this.updateShop(true); }
            this.points += foodEaten.points;
            this.updateShop(false);
            this.snake.addUndigestedFood(foodEaten.blocksAdded);
            this.eatingSound.play({ volume: 0.5, loop: false });
            this.updateRenderedMap(this.mapControllers.find(mc => mc.level == this.currentLevel));
            // boost charge
        }

        let stair = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkStairCollision(this.snake.position);
        if (stair != undefined) {
            this.stairClimbing(stair);
            this.stairSound.play({ volume: 0.1, loop: false, rate: 2 });
            this.updateShop(false);
        }

        let wallCollision = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkWallCollision(this.snake.position, this.throughWalls);
        if (wallCollision) {
            this.wallImpactSound.play({ volume: .5, loop: false });
            this.fatalCollision();
        }

        let shopItemHit = this.mapControllers.find(mc => mc.level == this.currentLevel)?.checkShopCollision(this.snake.position);
        if (shopItemHit != undefined) {
            this.shopBuying(shopItemHit);
            console.log(shopItemHit.item.code);
        }

        if (this.snake.selfCollision()) {
            this.wallImpactSound.play({ volume: .5, loop: false });
            this.fatalCollision();
        }

        if (this.joostPotionCounter > 0) {
            this.joostPotionCounter--;
            if (this.joostPotionCounter == 0) { this.deactivateThroughWalls(); }
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

    private shopBuying(elem: ShopElement) {
        if (elem.item == undefined) {
            throw Error('Shop item undefined');
        }
        if (elem.status == 'Purchasable') {
            this.points -= elem.item.cost;
            switch (elem.item.code) {
                case 'r10':
                    this.snake.reduce(10);
                    break;
                case 'r20':
                    this.snake.reduce(20);
                    break;
                case 'rhalf':
                    this.snake.reduce(Math.floor(this.snake.bodyParts.length / 2));
                    break;
                case 'life':
                    this.lives++;
                    break;
                case 'joost':
                    this.joostPotions++;
                    break;
            }
            elem.item.buy();
            elem.status = 'Purchased';


            this.updateShop(false);
        }
    }

    private updateShop(refreshItems: boolean) {
        if (refreshItems) {
            let newItems: number[] = [];
            while (newItems.length < 3) {
                let r = Math.floor(Math.random() * this.shopItems.length);
                if (newItems.indexOf(r) === -1) { newItems.push(r); }
            }
            for (let i = 0; i < 3; i++) {
                this.shopEl[i].item = this.shopItems[newItems[i]];
            }
        }
        this.shopItems.forEach(item => {
            item.description?.setVisible(false);
        })
        this.mapControllers.forEach(mc => {
            if (mc.level == MapLevel.Shop) {
                mc.map.childElements.forEach(elem => {
                    if (elem instanceof ShopElement) {
                        if (elem.item.description != undefined && this.currentLevel == MapLevel.Shop) {
                            elem.item.description.setPosition(elem.position.x * 10, elem.position.y * 10).setOrigin(0, 0).setVisible(true);
                        }
                        let color: number = 0;
                        if (elem.item.bought) { color = Colors.purchased; }
                        else if (elem.item.cost < this.points) {
                            elem.status = 'Purchasable';
                            color = Colors.purchasable;
                        }
                        else {
                            elem.status = 'NonPurchasable';
                            color = Colors.nonPurchasable;
                        }
                        elem.cells.forEach(cell => {
                            mc.map.Map2D[cell.x][cell.y].color = color;
                            cell.color = color;
                        });
                    }
                });
            }
        });
        this.updateRenderedMap(this.mapControllers.find(mc => mc.level == MapLevel.Shop));
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

    private changeLevel(newLevel: MapLevel) {
        let lastLevel = this.currentLevel;
        this.mapControllers.forEach(mc => {
            if (mc.active) {
                if (newLevel != mc.level) {
                    mc.setMapInvisible();
                } else {
                    mc.setMapVisible();
                }
            }
        });
        this.currentLevel = newLevel;

        if (lastLevel == MapLevel.Shop) { this.updateShop(false); }

    }

    private renderSnake() {
        this.events.emit('gameSnakeMove', this);
        if (this.snake?.bodyParts != null) {
            this.snake.bodyParts.forEach(part => {
                this.renderSnakePart(part);
            });
        }
    }

    private renderSnakePart(part: BodyPart) {
        const pixelX = (part.x - 1) * this.cellWidth + this.cellWidth / 2;
        const pixelY = (part.y - 1) * this.cellHeight + this.cellHeight / 2;
        let rotation: number = 0;
        switch (part.direction) {
            case 'Right':
                rotation = 0;
                break;
            case 'Left':
                rotation = 1;
                break;
            case 'Up':
                rotation = 2;
                break;
            case 'Down':
                rotation = 3;
                break;
        }

        // This function gets called... a lot (although 4x times should be enough, it's called for each bodypart).
        if (part.gameObject == null || part.gameObjectType != part.type || part.gameObjectDirection != part.direction) {
            part.gameObject?.destroy();
            if (part.level == this.currentLevel) {
                switch (part.type) {
                    case 'Head':
                        part.gameObject = this.add.sprite(pixelX, pixelY, 'snakeHead', rotation).setOrigin(0.5, 0.5);
                        break;
                    case 'Body':
                        part.gameObject = this.add.sprite(pixelX, pixelY, 'snakeBody', rotation).setOrigin(0.5, 0.5);
                        break;
                    case 'Tail':
                        part.gameObject = this.add.sprite(pixelX, pixelY, 'snakeTail', rotation).setOrigin(0.5, 0.5);
                        break;
                }
                part.gameObjectDirection = part.direction;
                part.gameObjectType = part.type;
            }
        }
        else {
            if (part.level == this.currentLevel) {
                part.gameObject.setPosition(pixelX, pixelY);
                part.gameObject.visible = true;
            }
            else {
                part.gameObject.visible = false;
            }
        }
    }

    public updateRenderedMap(mc: MapController | undefined) {
        this.renderCount++;
        console.log(this.renderCount);
        if (mc != undefined) {
            mc.map.Map2D
                .forEach(row => row
                    .forEach(cell => {
                        if (mc.renderedCells[cell.x] == null) {
                            mc.renderedCells[cell.x] = [];
                        }
                        if (cell.type == CellType.Void) {
                            mc.renderedCells[cell.x][cell.y].setFillStyle(cell.color, 0);

                        } else {
                            mc.renderedCells[cell.x][cell.y].setFillStyle(cell.color);
                        }
                    }));
            mc.map.childElements.forEach(elem => {
                if (elem instanceof Food && elem.type == 'Beer' && elem.image == undefined) {
                    elem.cells.forEach(cell => {
                        mc.renderedCells[cell.x][cell.y].setAlpha(0);
                    });
                    let x = elem.TopLeftCell.x * this.cellWidth;
                    let y = elem.TopLeftCell.y * this.cellHeight;
                    elem.image = this.add.sprite(x, y, 'beerCaps', Math.floor(Math.random() * 6));
                }
            });
        }
    }

    public getScore() {
        if (this.points != undefined) { return this.points; }
        else { return 0; }
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

    private generateShop() {
        this.shopItems?.forEach(item => {
            item.description?.destroy();
        });
        this.shopItems = [];


        this.shopItems.push(new ShopItem('r10', 150));
        this.shopItems.push(new ShopItem('r20', 250));
        this.shopItems.push(new ShopItem('rhalf', 300));
        let im = this.add.sprite(0, 0, 'ELdesc');
        this.shopItems.push(new ShopItem('life', 200, im));
        im = this.add.sprite(0, 0, 'JPdesc');
        this.shopItems.push(new ShopItem('joost', 150, im));

        // Not Implemented Yet
        // this.shopItems.push(new ShopItem('cm1', 300))
        // this.shopItems.push(new ShopItem('cm2', 300))
        // this.shopItems.push(new ShopItem('mb', 300))
        // this.shopItems.push(new ShopItem('wp', 300))
    }

    private activateThroughWalls() {
        this.throughWalls = true;
        this.mapControllers.forEach(mc => {
            mc.map.childElements.forEach(elem => {
                if (elem instanceof Wall && elem.removable) {
                    elem.cells.forEach(cell => {
                        mc.renderedCells[cell.x][cell.y].setAlpha(0.2);
                    });
                    elem.setStatus('seeThrough');
                }
            });
        });
        this.changeLevel(this.currentLevel);
    }
    private deactivateThroughWalls() {
        this.throughWalls = false;
        this.mapControllers.forEach(mc => {
            mc.map.childElements.forEach(elem => {
                if (elem instanceof Wall && elem.status == 'seeThrough') {
                    elem.cells.forEach(cell => {
                        mc.renderedCells[cell.x][cell.y].setAlpha(1);
                    });
                    elem.setStatus('visible');
                }
            });
        });
    }

    public useLife(): boolean {
        if (this.lives > 0) {
            this.lives--;
            return true;
        }
        return false;
    }

    private fatalCollision() {
        if (this.useLife()) {
            let useLife = this.add.text(SW / 2, SH / 2, "Life Used").setOrigin(0.5, 0.5);
            this.scene.pause();
            setTimeout(() => {
                this.changeLevel(MapLevel.FirstFloor);
                let snakeLength = this.snake.bodyParts.length;
                this.snake.reset();
                this.snake = new Snake(new Vector2(15, 16), snakeLength, 'Right', MapLevel.FirstFloor);
                useLife.destroy();
                this.scene.resume();
            }, 1000);

        } else {
            let deathText = this.add.text(SW / 2, SH / 2, "You died!").setOrigin(0.5, 0.5);
            this.scene.pause();
            setTimeout(() => {
                this.resetGame();
                deathText.destroy();
                this.scene.resume();
            }, 1000);
        }
    }

    private resetGame() {
        this.snake?.reset();
        this.points = 0;
        this.lives = 0;
        this.joostPotions = 0;
        this.throughWalls = false;
        this.deactivateThroughWalls();
        this.generateShop();
        this.updateShop(true);
        this.snake = new Snake(new Vector2(15, 16), 20, 'Right', MapLevel.FirstFloor);
        if (this.mapControllers[0].map) { this.changeLevel(MapLevel.FirstFloor); }
    }

    // temporary function
    private addAllMainObjects() {
        for (let mo of this.mainObjects) {
            this.mapControllers.find(mc => mc.level === mo.level)?.map.appendElement(mo, true);
        }
    }
}
