import { GameInstance } from "@ion-phaser/react";

export default interface GameCanvasSize {
    height: number,
    width: number,
}
export interface GameCanvasProps {
    gameCanvasSize: GameCanvasSize
}
export interface GameCanvasState {
    initialize: boolean,
    game: GameInstance,
}
