import { Direction, CELLS_Y, CELLS_X, MapLevel } from './Common';
import { Vector2 } from '../Generics';
type BodyPartType = 'Head' | 'Body' | 'Tail';

export class BodyPart {
    public position: Vector2;
    public level?: MapLevel;
    public type: BodyPartType;
    public direction: Direction;
    public gameObject!: Phaser.GameObjects.Sprite;
    public gameObjectDirection!: Direction;
    public gameObjectType!: BodyPartType;
    public foodStored: boolean;

    public floor!: number;

    /**
     * Gets x-position of body part (readonly)
     */
    get x(): number {
        return this.position.x;
    }

    /**
     * Gets y-position of body part (readonly)
     */
    get y(): number {
        return this.position.y;
    }

    constructor(
        position: Vector2, 
        type: BodyPartType, 
        direction: Direction, 
        level?: MapLevel
    ) {
        this.position = position;
        this.type = type;
        this.foodStored = false;
        this.level = level;
        this.direction = direction;
    }

    public toInt() {
        switch (this.type) {
            case 'Head':
                return 0;
            case 'Body':
                return 1;
            case 'Tail':
                return 2;
            default:
                return 1;
        }
    }

    public toCharacter() {
        switch (this.type) {
            case 'Head':
                return 'D';
            case 'Body':
                return 'S';
            case 'Tail':
                return '4';
            default:
                return '';
        }
    }
}

export class Snake {
    position: Vector2;
    level?: MapLevel;
    direction: Direction;
    bodyParts!: BodyPart[];

    get x(): number {
        return this.position.x;
    }
    get y(): number {
        return this.position.y;
    }

    constructor(
        position: Vector2, 
        initialLength: number, 
        initialDirection: Direction = 'Up', 
        initialLevel?: MapLevel
    ) {
        this.position = position;
        this.level = initialLevel;
        this.direction = initialDirection;

        this.emptySnake();
        this.generateSnake(initialLength);
    }

    public emptySnake() {
        this.bodyParts = [];
    }

    public generateSnake(length: number) {
        let xPart = this.position.x;
        let yPart = this.position.y;

        this.bodyParts.push(new BodyPart(new Vector2(xPart, yPart), 'Head', 'Right', this.level));
        for (let i = 0; i < length - 1; i++) {
            let resultX;
            let resultY;
            switch (this.direction) {
                case 'Up':
                    resultY = yPart > 0 ? yPart-- : null;
                    break;
                case 'Down':
                    resultY = yPart < CELLS_Y ? yPart-- : null;
                    break;
                case 'Right':
                    resultX = xPart < CELLS_X ? xPart-- : null;
                    break;
                case 'Left':
                    resultX = xPart < CELLS_X ? xPart++ : null;
                    break;
            }

            // Dont allow overflow of body part
            if (resultX != null || resultY != null) {
                if (i == length - 2) {
                    this.bodyParts.push(new BodyPart(new Vector2(xPart, yPart), 'Tail', 'Right', this.level));
                } else {
                    this.bodyParts.push(new BodyPart(new Vector2(xPart, yPart), 'Body', 'Right', this.level));
                }
            }
            else {
                throw new Error("Trying to render Snake BodyPart outside game area.");
            }
        }
    }

    public rotateSnake(direction: Direction | undefined) {
        if (direction != undefined) { this.direction = direction; }
    }

    public rotateLeft() {
        switch (this.direction) {
            case 'Up':
                this.direction = 'Left';
                break;
            case 'Down':
                this.direction = 'Left';
                break;
        }
    }

    public rotateRight() {
        switch (this.direction) {
            case 'Up':
                this.direction = 'Right';
                break;
            case 'Down':
                this.direction = 'Right';
                break;
        }
    }

    public rotateUp() {
        switch (this.direction) {
            case 'Right':
                this.direction = 'Up';
                break;
            case 'Left':
                this.direction = 'Up';
                break;
        }
    }

    public rotateDown() {
        switch (this.direction) {
            case 'Right':
                this.direction = 'Down';
                break;
            case 'Left':
                this.direction = 'Down';
                break;
        }
    }

    public moveSnakeTo(pos: Vector2, level?: MapLevel) {
        this.position = pos;
        this.level = level;

        let newX = this.position.x;
        let newY = this.position.y;
        let newL = this.level;
        let newFoodStored = false;
        let newDirection = this.direction;
        let increaseLength: boolean = this.completeDigestion();

        this.bodyParts.forEach(part => {
            if (increaseLength && part.type == 'Tail') {
                const currPart = this.bodyParts.pop();
                this.bodyParts.push(new BodyPart(new Vector2(newX, newY), 'Body', newDirection, this.level));
                if (currPart != undefined) {
                    this.bodyParts.push(currPart);
                }
                // part.type = 'Body';
            } else {
                const currX = part.position.x;
                const currY = part.position.y;
                const cuurL = part.level;
                const currF = part.foodStored;
                const currD = part.direction;

                part.position.x = newX;
                part.position.y = newY;
                part.level = newL;
                part.foodStored = newFoodStored;
                part.direction = newDirection

                newX = currX;
                newY = currY;
                newL = cuurL;
                newFoodStored = currF;
                newDirection = currD
            }
        });
    }

    public moveSnake() {
        switch (this.direction) {
            case 'Up':
                this.position.y--;
                break;
            case 'Down':
                this.position.y++;
                break;
            case 'Right':
                this.position.x++;
                break;
            case 'Left':
                this.position.x--;
                break;
        }

        let newX = this.position.x;
        let newY = this.position.y;
        let newL = this.level;
        let newFoodStored = false;
        let newDirection = this.direction;
        let increaseLength: boolean = this.completeDigestion();

        this.bodyParts.forEach(part => {
            if (increaseLength && part.type == 'Tail') {
                const currPart = this.bodyParts.pop();
                this.bodyParts.push(new BodyPart(new Vector2(newX, newY), 'Body', newDirection, this.level));
                if (currPart != undefined) {
                    this.bodyParts.push(currPart);
                }
                // part.type = 'Body';
            } else {
                const currX = part.position.x;
                const currY = part.position.y;
                const cuurL = part.level;
                const currF = part.foodStored;
                const currD = part.direction;

                part.position.x = newX;
                part.position.y = newY;
                part.level = newL;
                part.foodStored = newFoodStored;
                part.direction = newDirection

                newX = currX;
                newY = currY;
                newL = cuurL;
                newFoodStored = currF;
                newDirection = currD
            }
        });
    }

    public addUndigestedFood(nBlocks: number) {
        let count: number = 0;
        for (let i = 0; i < this.bodyParts.length; i++) {
            if (!this.bodyParts[i].foodStored) {
                this.bodyParts[i].foodStored = true;
                count++;
                if (count == nBlocks) { return; }
            }
        }
    }

    public completeDigestion(): boolean {
        return this.bodyParts.find(part => {
            if (part.type == 'Tail' && part.foodStored) {
                part.foodStored = false;
                return true;
            }
        }) != null;
    }

    public reduce(length: number) {
        let blocksRemoved = 0;

        if (length <= 0) { return; }

        for (let part of this.bodyParts) {
            if (part.foodStored) {
                part.foodStored = false;
                blocksRemoved++;
                if (blocksRemoved >= length) { return; }
            }
        }
        const bodyLength = this.bodyParts.length;
        let tail = this.bodyParts.pop();
        let lastBodyPart: BodyPart | undefined;
        for (let i = 0; i < Math.min(length - blocksRemoved, bodyLength - 3); i++) {
            lastBodyPart = this.bodyParts.pop();
            lastBodyPart?.gameObject.destroy();
        }
        if (tail != undefined) {
            this.bodyParts.push(tail);
            if (lastBodyPart != undefined) {
                tail.position = lastBodyPart.position;
                tail.direction = lastBodyPart.direction;
            }
        }
    }

    public getHeadFoodStatus(): boolean {
        let part = this.bodyParts.find(part => {
            if (part.type == 'Head') {
                return part;
            }
        });

        if (part != null) {
            return part.foodStored;
        } else {
            console.warn("GetHeadFoodStatus function: Snake head not found.");
            return false;
        }
    }

    public selfCollision() {
        return this.bodyParts.find(part => {
            if (part.type != 'Head' && part.position.x == this.position.x && part.position.y == this.position.y && part.level == this.level) {
                return true;
            }
        }) != null;
    }

    public reset() {
        this.bodyParts.forEach(part => {
            part.gameObject.destroy();
        });

        this.emptySnake();
    }
}
