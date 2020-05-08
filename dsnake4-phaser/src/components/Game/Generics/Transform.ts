import { Vector2 } from './Vector2';
import { SW, SH } from '../GameConfig';

export class Transform {
    readonly origin: Vector2;
    readonly width: number = SW;
    readonly height: number = SH;

    constructor(origin: Vector2, width?: number, height?: number) {
        this.origin = origin;
        if (width != null) {
            this.width = width;
        }
        if (height != null) {
            this.height = height;
        }
    }
}
