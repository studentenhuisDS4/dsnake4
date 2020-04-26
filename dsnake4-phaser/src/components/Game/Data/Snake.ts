import { Direction, CELLS_Y, CELLS_X } from './Generics';
import { XY } from './Map/MapElements';
type BodyPartType = 'Head' | 'Body' | 'Tail';

export class BodyPart {
    public x: number;
    public y: number;
    public type: BodyPartType;
    public gameObject!: Phaser.GameObjects.Text;

    public floor!: number;

    constructor(x: number, y: number, type: BodyPartType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public toCharacter() {
        switch (this.type) {
            case 'Body':
                return 'S';
            case 'Head':
                return 'D';
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
                this.y < CELLS_Y ? this.y-- : null;
                break;
            case 'Down':
                this.y > 0 ? this.y++ : null;
                break;
            case 'Right':
                this.x < CELLS_X ? this.x++ : null;
                break;
            case 'Left':
                this.x < CELLS_X ? this.x-- : null;
                break;
        }
        let newX = this.x;
        let newY = this.y;
        this.bodyParts.forEach(part => {
            const currX = part.x;
            const currY = part.y;
            part.x = newX;
            part.y = newY;

            newX = currX;
            newY = currY;
        });

        if (this.selfCollision()) {
            console.log('Collided');
        }

    }

    public getHeadPosition(): XY | null {
        let part = this.bodyParts.find(part => {
            if (part.type == 'Head') {
                return part;
            }
        });

        if (part != null) {
            return new XY(part.x, part.y);
        } else {
            console.warn("GetHeadPosition function: Snake head not found.");
            return null;
        }
    }

    public selfCollision() {
        let headXY = this.getHeadPosition();

        return this.bodyParts.find(part => {
            if (headXY != null) {
                if (part.type != 'Head' && part.x == headXY.x && part.y == headXY.y) {
                    return true;
                }
            }
        }) != null;

        // return collision;
    }
}
