import { Direction, CELLS_Y, CELLS_X, Vector2, MapLevel as Level } from './Generics';
type BodyPartType = 'Head' | 'Body' | 'Tail';

export class BodyPart {
    public position: Vector2;
    public level?: Level;
    public type: BodyPartType;
    public gameObject!: Phaser.GameObjects.Text;
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

    constructor(position: Vector2, type: BodyPartType, level?: Level) {
        this.position = position;
        this.type = type;
        this.foodStored = false;
        this.level = level;
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
    level?: Level;
    direction: Direction;
    bodyParts!: BodyPart[];

    get x(): number {
        return this.position.x;
    }
    get y(): number {
        return this.position.y;
    }

    constructor(position: Vector2, initialLength: number, initialDirection: Direction = 'Up', initialLevel?: Level) {
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

        this.bodyParts.push(new BodyPart(new Vector2(xPart, yPart), 'Head', this.level));
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
                    this.bodyParts.push(new BodyPart(new Vector2(xPart, yPart), 'Tail', this.level));
                } else {
                    this.bodyParts.push(new BodyPart(new Vector2(xPart, yPart), 'Body', this.level));
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

    public moveSnakeTo(pos: Vector2, level?: Level) {
        this.position = pos;
        this.level = level;

        let newX = this.position.x;
        let newY = this.position.y;
        let newL = this.level;
        let newFoodStored = false;
        let increaseLength: boolean = this.completeDigestion();

        this.bodyParts.forEach(part => {
            const currX = part.position.x;
            const currY = part.position.y;
            const cuurL = part.level;
            const currF = part.foodStored;

            part.position.x = newX;
            part.position.y = newY;
            part.level = newL;
            part.foodStored = newFoodStored;

            newX = currX;
            newY = currY;
            newL = cuurL;
            newFoodStored = currF;

            if (increaseLength && part.type == 'Tail') {
                part.type = 'Body';
            }
        });

        if (increaseLength) {
            this.bodyParts.push(new BodyPart(new Vector2(newX, newY), 'Tail', this.level));
        }
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
        let increaseLength: boolean = this.completeDigestion();

        this.bodyParts.forEach(part => {
            const currX = part.position.x;
            const currY = part.position.y;
            const cuurL = part.level;
            const currF = part.foodStored;

            part.position.x = newX;
            part.position.y = newY;
            part.level = newL;
            part.foodStored = newFoodStored;

            newX = currX;
            newY = currY;
            newL = cuurL;
            newFoodStored = currF;

            if (increaseLength && part.type == 'Tail') {
                part.type = 'Body';
            }
        });

        if (increaseLength) {
            this.bodyParts.push(new BodyPart(new Vector2(newX, newY), 'Tail', this.level));
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
