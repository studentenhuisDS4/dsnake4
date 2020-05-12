export interface ChatMessage {
    id: number;
    author: PlayerModel;
    dateAdded: Date,
    message: string;
}

interface PlayerModel {
    id: string,
    name: string,
}