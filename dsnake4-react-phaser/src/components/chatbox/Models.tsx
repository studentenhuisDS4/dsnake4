import { Player, ChatMessage } from 'src/../../chatbox-backend/src/models/types';

// Extend the ChatMessage API by a model
export interface PlayerModel extends Player {
    uuid: string;
}

// Mimic the ChatMessage API by a model
export interface ChatMessageModel extends ChatMessage {
    
}

// Extend the API by a model
export interface ReplyChatMessageModel extends ChatMessage {
    replyMsgId: number;
}

// The ChatMessage component props and/or state models
export interface ChatMessageComponentModel extends ChatMessage {
    player_id: number;
}

// The Chatbox component props and/or state models
export interface ChatboxProps {
    changePlayerName: () => void,
    player: PlayerModel,
}
export interface ChatboxState {
    messages: ChatMessageModel[],
}