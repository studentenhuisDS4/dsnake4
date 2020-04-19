type SnakeDirection = 'Up' | 'Right' | 'Left' | 'Down';
type BodyPartType = 'Head' | 'Body' | 'Tail';

// TODO generalize later
let cellsX: number = 105;
let cellsY: number = 60;

class BodyPart {
    public x: number;
    public y: number;
    public type: BodyPartType;

    constructor(x: number, y: number, type: BodyPartType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

export class Snake {
    direction: SnakeDirection;
    bodyParts!: BodyPart[];

    constructor(initialLength: number, x: number, y: number, initialDirection: SnakeDirection = 'Up') {
        this.direction = initialDirection;

        this.generateSnake(initialLength, x, y);
    }

    private generateSnake(length: number, x: number, y: number) {
        let xPart = x;
        let yPart = y;
        this.bodyParts = [];
        this.bodyParts.push(new BodyPart(xPart, yPart, 'Head'));
        console.log("Rendering snake");
        for (let i = 0; i < length - 1; i++) {
            let resultX;
            let resultY;
            switch (this.direction) {
                case 'Up':
                    resultY = yPart < cellsY ? yPart-- : null;
                    break;
                case 'Down':
                    resultY = yPart > 0 ? yPart-- : null;
                    break;
                case 'Right':
                    resultX = xPart < cellsX ? xPart++ : null;
                    break;
                case 'Left':
                    resultX = xPart < cellsX ? xPart-- : null;
                    break;
            }
            // Dont allow overflow of body part
            if (resultX != null || resultY != null) {
                this.bodyParts.push(new BodyPart(xPart, yPart, 'Body'));
            }
            else {
                throw new Error("Trying to render Snake BodyPart outside game area.");
            }
        }

        // We draw Tail with separate character
        this.bodyParts.push(new BodyPart(xPart, yPart, 'Tail'));
    }
}