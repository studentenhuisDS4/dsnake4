import {PlayerModel} from "src/components/chatbox/Models";

export interface AppProps {}
export default interface AppState {
    activeLanguage: string,
    initializeGame: boolean,
    isLoggedIn: boolean,
    player: PlayerModel,
}