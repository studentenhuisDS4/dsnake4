// A model describing the player object
export interface PlayerModel {
    id: string,
    name: string,
}

// The model describing a chat message
export default interface ChatMessageModel {
    id: number;
    author: PlayerModel,
    dateAdded: number,
    message: string;
}
export interface ReplyChatMessageModel extends ChatMessageModel {
    replyMsgId: number;
}

// The ChatMessage component props and/or state models
export interface ChatMessageComponentModel extends ChatMessageModel {
    player: PlayerModel,
}

// The Chatbox component props and/or state models
export interface ChatboxProps {
    changePlayerName: () => void,
    player: PlayerModel,
}
export interface ChatboxState {
    messages: ChatMessageModel[],
}