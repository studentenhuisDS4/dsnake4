import React from 'react';
import { GameInstance } from "@ion-phaser/react";

export default interface GameCanvasSize {
    height: number,
    width: number,
}
export interface GameCanvasProps {}
export interface GameCanvasState {
    initialize: boolean,
    loadGame: boolean,
    game: GameInstance,
}
