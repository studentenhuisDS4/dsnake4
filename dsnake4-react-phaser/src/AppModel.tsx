import GameCanvasSize from "src/components/game/Models";

export interface AppProps {}
export default interface AppState {
    activeLanguage: string,
    gameCanvasSize: GameCanvasSize,
    initializeApp: boolean,
    initializeGame: boolean,
    playerName: string,
}