export interface Auth<T> {
    token: string;
    chatMessage: T;
}

export interface Player {
    user_id: number;
    nickname: string;
}

export interface ChatMessage extends Player {
    uuid: number;
    time: Date;
    message: string;
}

export interface ChatMessageCreate {
    nickname: string;
    message: string;
}

export interface HighScore extends Player {
    id: number;
    time: Date;
    score: number;
}