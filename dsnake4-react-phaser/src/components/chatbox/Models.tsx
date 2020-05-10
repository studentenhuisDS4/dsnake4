export default interface ChatMessageModel {
    id: number;
    dateAdded: Date,
    message: string;
    playerName: string,
}
export interface ReplyChatMessageModel extends ChatMessageModel {
    replyMsgId: number;
}
export interface ChatMessageComponentModel extends ChatMessageModel {
    position: 'left' | 'right',
}

export interface ChatboxProps {
    changePlayerName: () => void,
    playerName: string,
}
export interface ChatboxState {
    chats: ChatMessageModel[],
}