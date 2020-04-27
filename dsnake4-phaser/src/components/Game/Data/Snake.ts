import { Direction, CELLS_Y, CELLS_X } from './Generics';
import { XY } from './Map/MapElements';
type BodyPartType = 'Head' | 'Body' | 'Tail';

export class BodyPart {
    public x: number;
    public y: number;
    public type: BodyPartType;
    public gameObject!: Phaser.GameObjects.Text;
    public foodStored: boolean;

    public floor!: number;

    constructor(x: number, y: number, type: BodyPartType) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.foodStored = false;
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
    x: number;
    y: number;
    direction: Direction;
    bodyParts!: BodyPart[];

    constructor(initialLength: number, x: number, y: number, initialDirection: Direction = 'Up') {
        this.direction = initialDirection;
        this.x = x;
        this.y = y;

        this.emptySnake();
        this.generateSnake(initialLength);
    }

    public emptySnake() {
        this.bodyParts = [];
    }

    public generateSnake(length: number) {
        let xPart = this.x;
        let yPart = this.y;

        this.bodyParts.push(new BodyPart(xPart, yPart, 'Head'));
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
                    this.bodyParts.push(new BodyPart(xPart, yPart, 'Tail'));
                } else {
                    this.bodyParts.push(new BodyPart(xPart, yPart, 'Body'));
                }
            }
            else {
                throw new Error("Trying to render Snake BodyPart outside game area.");
            }
        }
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

    public moveSnake() {
        switch (this.direction) {
            case 'Up':
                this.y--;
                break;
            case 'Down':
                this.y++;
                break;
            case 'Right':
                this.x++;
                break;
            case 'Left':
                this.x--;
                break;
        }

        let newX = this.x;
        let newY = this.y;
        let newFoodStored = false;

        let increaseLength: boolean = this.completeDigestion();

        this.bodyParts.forEach(part => {
            const currX = part.x;
            const currY = part.y;
            const currF = part.foodStored;

            part.x = newX;
            part.y = newY;
            part.foodStored = newFoodStored;

            newX = currX;
            newY = currY;
            newFoodStored = currF;

            if (increaseLength && part.type == 'Tail') {
                part.type = 'Body';
            }
        });

        if (increaseLength) {
            this.bodyParts.push(new BodyPart(newX, newY, 'Tail'));
        }
    }

    public addUndigestedFood(nBlocks: number) {
        let count: number = 0;
        for (let i = 0; i < this.bodyParts.length; i++) {
            if (!this.bodyParts[i].foodStored) {
                this.bodyParts[i].foodStored = true;
                count++;
            }
            if (count == nBlocks) {
                return;
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

    public getHeadFoodStatus(): boolean {
        let part = this.bodyParts.find(part => {
            if (part.type == 'Head') {
                return part;
            }
        });

        if (part != null) {
            return part.foodStored;
        } else {
            console.warn("GetHeadPosition function: Snake head not found.");
            return false;
        }
    }

    public selfCollision() {
        return this.bodyParts.find(part => {
            if (part.type != 'Head' && part.x == this.x && part.y == this.y) {
                return true;
            }
        }) != null;
    }
}
